import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    const [allBookings, allCustomers, activeOffers, upcomingEvents, stations, zones] =
      await Promise.all([
        db.findMany("bookings"),
        db.findMany("users", (u) => u.role === "CUSTOMER"),
        db.findMany("offers", (o) => o.status === "PUBLISHED"),
        db.findMany("events", (e) => e.status !== "DRAFT"),
        db.findMany("stations"),
        db.findMany("gaming_zones"),
      ]);

    // Financial & Operational Metrics
    const completedBookings = allBookings.filter((b) => b.paymentStatus === "COMPLETED");
    const totalRevenue = completedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    const todayBookings = allBookings.filter(
      (b) => b.bookingDate === todayStr && b.bookingStatus !== "CANCELLED"
    );
    const todayRevenue = todayBookings
      .filter((b) => b.paymentStatus === "COMPLETED")
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    const upcomingBookings = allBookings.filter(
      (b) => b.bookingDate >= todayStr && b.bookingStatus !== "CANCELLED"
    );

    const activeSessions = allBookings.filter(
      (b) => b.bookingDate === todayStr && (b.bookingStatus === "IN_PROGRESS" || b.bookingStatus === "CONFIRMED")
    );

    const averageTicket =
      completedBookings.length > 0 ? Math.round(totalRevenue / completedBookings.length) : 0;

    // 30-Day and 7-Day Timeframe Metrics
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0];
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];

    const revenueLast30Days = completedBookings
      .filter((b) => b.bookingDate >= thirtyDaysAgo)
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    const revenueLast7Days = completedBookings
      .filter((b) => b.bookingDate >= sevenDaysAgo)
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    // Build 30-Day Daily Chart Data
    const dailyMap = new Map();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const dStr = d.toISOString().split("T")[0];
      const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
      const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      dailyMap.set(dStr, {
        date: dStr,
        day: dayName,
        label,
        revenue: 0,
        bookingsCount: 0,
        hoursPlayed: 0,
        vr: 0,
        ps5: 0,
        pc: 0,
        racing: 0,
      });
    }

    allBookings.forEach((b) => {
      if (dailyMap.has(b.bookingDate)) {
        const item = dailyMap.get(b.bookingDate);
        item.bookingsCount += 1;
        item.hoursPlayed += b.durationHours || 1;
        if (b.paymentStatus === "COMPLETED") {
          item.revenue += b.totalAmount || 0;
          if (b.zoneId === "zone-vr") item.vr += b.totalAmount || 0;
          else if (b.zoneId === "zone-ps5") item.ps5 += b.totalAmount || 0;
          else if (b.zoneId === "zone-pc") item.pc += b.totalAmount || 0;
          else if (b.zoneId === "zone-racing") item.racing += b.totalAmount || 0;
        }
      }
    });

    const chartData = Array.from(dailyMap.values());

    // Enrich stations with real-time occupancy status
    const enrichedStations = stations.map((st) => {
      const activeBooking = activeSessions.find(
        (b) => b.stationId === st.id || (b.zoneId === st.zoneId && b.stationNumber === st.stationNumber)
      );

      let liveStatus: string = st.status;
      let currentSession = null;

      if (activeBooking) {
        liveStatus = activeBooking.bookingStatus === "IN_PROGRESS" ? "IN_USE" : "RESERVED";
        currentSession = {
          bookingRef: activeBooking.bookingRef,
          customerName: activeBooking.customerName,
          time: `${activeBooking.startTime} - ${activeBooking.endTime}`,
          duration: `${activeBooking.durationHours} hrs`,
          specialRequests: activeBooking.specialRequests,
        };
      }

      return {
        ...st,
        liveStatus,
        currentSession,
      };
    });

    // Zone Breakdown
    const zoneBreakdown = zones.map((z) => {
      const zoneBookings = allBookings.filter((b) => b.zoneId === z.id);
      const zoneRev = zoneBookings
        .filter((b) => b.paymentStatus === "COMPLETED")
        .reduce((sum, b) => sum + (b.totalAmount || 0), 0);
      const zoneStations = enrichedStations.filter((s) => s.zoneId === z.id);
      const occupiedStations = zoneStations.filter((s) => s.liveStatus === "IN_USE" || s.liveStatus === "RESERVED").length;

      return {
        id: z.id,
        name: z.name,
        slug: z.slug,
        hourlyRate: z.hourlyRate,
        totalStations: z.totalStations || zoneStations.length,
        occupiedStations,
        revenue: zoneRev,
        bookingsCount: zoneBookings.length,
      };
    });

    return NextResponse.json({
      metrics: {
        totalRevenue,
        revenueLast30Days,
        revenueLast7Days,
        todayRevenue,
        totalBookings: allBookings.length,
        todayBookingsCount: todayBookings.length,
        upcomingBookingsCount: upcomingBookings.length,
        activeSessionsCount: activeSessions.length,
        totalCustomers: allCustomers.length,
        totalStations: stations.length,
        availableStationsCount: enrichedStations.filter((s) => s.liveStatus === "AVAILABLE").length,
        inUseStationsCount: enrichedStations.filter((s) => s.liveStatus === "IN_USE").length,
        reservedStationsCount: enrichedStations.filter((s) => s.liveStatus === "RESERVED").length,
        averageTicket,
        activeOffersCount: activeOffers.length,
        upcomingEventsCount: upcomingEvents.length,
      },
      chartData,
      zoneBreakdown,
      stations: enrichedStations,
      recentBookings: allBookings.slice(-15).reverse(),
      upcomingEvents,
      activeOffers,
    });
  } catch (error: any) {
    console.error("Admin Dashboard Error:", error);
    return NextResponse.json({ error: "Failed to fetch admin metrics" }, { status: 500 });
  }
}
