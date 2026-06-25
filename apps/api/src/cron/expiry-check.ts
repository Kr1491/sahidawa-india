import cron from "node-cron";
import { supabase } from "../db/client";
import logger from "../utils/logger";

export const initExpiryCron = () => {
    // Runs every day at 00:00 (midnight)
    cron.schedule("0 0 * * *", async () => {
        logger.info("Running medicine expiry check...");

        // --- 30-day window ---
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        const { data: data30, error: error30 } = await supabase
            .from("tracked_medicines")
            .select("*")
            .lte("expiry_date", thirtyDaysFromNow.toISOString())
            .eq("notified_30d", false);

        if (error30) {
            logger.error("Error fetching 30d expiring medicines", { error: error30 });
        } else {
            for (const medicine of data30 || []) {
                // e.g., sendNotification(medicine.user_id, "Your medicine expires in 30 days!");
                await supabase
                    .from("tracked_medicines")
                    .update({ notified_30d: true })
                    .eq("id", medicine.id);
            }
            logger.info(`30d check done. ${data30?.length || 0} medicines processed.`);
        }

        // --- 14-day window ---
        const fourteenDaysFromNow = new Date();
        fourteenDaysFromNow.setDate(fourteenDaysFromNow.getDate() + 14);

        const { data: data14, error: error14 } = await supabase
            .from("tracked_medicines")
            .select("*")
            .lte("expiry_date", fourteenDaysFromNow.toISOString())
            .eq("notified_14d", false);

        if (error14) {
            logger.error("Error fetching 14d expiring medicines", { error: error14 });
        } else {
            for (const medicine of data14 || []) {
                // e.g., sendNotification(medicine.user_id, "Your medicine expires in 14 days!");
                await supabase
                    .from("tracked_medicines")
                    .update({ notified_14d: true })
                    .eq("id", medicine.id);
            }
            logger.info(`14d check done. ${data14?.length || 0} medicines processed.`);
        }

        // --- 7-day window ---
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

        const { data: data7, error: error7 } = await supabase
            .from("tracked_medicines")
            .select("*")
            .lte("expiry_date", sevenDaysFromNow.toISOString())
            .eq("notified_7d", false);

        if (error7) {
            logger.error("Error fetching 7d expiring medicines", { error: error7 });
        } else {
            for (const medicine of data7 || []) {
                // e.g., sendNotification(medicine.user_id, "Your medicine expires in 7 days!");
                await supabase
                    .from("tracked_medicines")
                    .update({ notified_7d: true })
                    .eq("id", medicine.id);
            }
            logger.info(`7d check done. ${data7?.length || 0} medicines processed.`);
        }
    });
};