ALTER TABLE "bookings" ALTER COLUMN "booking_form_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "data" SET DEFAULT '{}'::jsonb;--> statement-breakpoint
ALTER TABLE "booking_forms" ADD COLUMN "mark_required" boolean DEFAULT true NOT NULL;