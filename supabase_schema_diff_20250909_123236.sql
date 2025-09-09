create type "public"."firm_status" as enum ('pending', 'approved', 'rejected', 'expired');

drop trigger if exists "update_analytics_events_updated_at" on "public"."analytics_events";

drop trigger if exists "update_notification_campaigns_updated_at" on "public"."notification_campaigns";

drop trigger if exists "update_notification_templates_updated_at" on "public"."notification_templates";

drop trigger if exists "update_template_analytics_updated_at" on "public"."template_analytics";

drop trigger if exists "update_user_behavior_stats_updated_at" on "public"."user_behavior_stats";

drop policy "Service role can view all analytics" on "public"."analytics_events";

drop policy "Service role can manage all documents" on "public"."documents";

drop policy "Anyone can insert errors" on "public"."error_logs";

drop policy "Service role can view all errors" on "public"."error_logs";

drop policy "Anyone can view campaigns" on "public"."notification_campaigns";

drop policy "Service role can manage campaigns" on "public"."notification_campaigns";

drop policy "Anyone can insert events" on "public"."notification_events";

drop policy "Users can view own events" on "public"."notification_events";

drop policy "Service can manage queue" on "public"."notification_queue";

drop policy "Service role can manage queue" on "public"."notification_queue";

drop policy "Anyone can view templates" on "public"."notification_templates";

drop policy "Service role can manage templates" on "public"."notification_templates";

drop policy "Anyone can insert performance metrics" on "public"."performance_metrics";

drop policy "Service role can view all metrics" on "public"."performance_metrics";

drop policy "Service role can update notification status" on "public"."pro_waitlist";

drop policy "Users can insert own waitlist entry" on "public"."pro_waitlist";

drop policy "Users can update own waitlist entry" on "public"."pro_waitlist";

drop policy "Users can view own waitlist entry" on "public"."pro_waitlist";

drop policy "Service role can manage all profiles" on "public"."profiles";

drop policy "Users can insert own profile" on "public"."profiles";

drop policy "Users can insert own searches" on "public"."search_analytics";

drop policy "Users can view own searches" on "public"."search_analytics";

drop policy "Anyone can view template analytics" on "public"."template_analytics";

drop policy "Service can insert template analytics" on "public"."template_analytics";

drop policy "Service can update template analytics" on "public"."template_analytics";

drop policy "Service role can view all behavior stats" on "public"."user_behavior_stats";

drop policy "Users can insert own behavior stats" on "public"."user_behavior_stats";

drop policy "Users can update own behavior stats" on "public"."user_behavior_stats";

drop policy "Users can view own behavior stats" on "public"."user_behavior_stats";

drop policy "Users can insert own events" on "public"."analytics_events";

drop policy "Users can view their own documents" on "public"."documents";

drop policy "Users can view their own profile" on "public"."profiles";

drop policy "Users can insert own sessions" on "public"."user_sessions";

drop policy "Users can update own sessions" on "public"."user_sessions";

revoke delete on table "public"."error_logs" from "anon";

revoke insert on table "public"."error_logs" from "anon";

revoke references on table "public"."error_logs" from "anon";

revoke select on table "public"."error_logs" from "anon";

revoke trigger on table "public"."error_logs" from "anon";

revoke truncate on table "public"."error_logs" from "anon";

revoke update on table "public"."error_logs" from "anon";

revoke delete on table "public"."error_logs" from "authenticated";

revoke insert on table "public"."error_logs" from "authenticated";

revoke references on table "public"."error_logs" from "authenticated";

revoke select on table "public"."error_logs" from "authenticated";

revoke trigger on table "public"."error_logs" from "authenticated";

revoke truncate on table "public"."error_logs" from "authenticated";

revoke update on table "public"."error_logs" from "authenticated";

revoke delete on table "public"."error_logs" from "service_role";

revoke insert on table "public"."error_logs" from "service_role";

revoke references on table "public"."error_logs" from "service_role";

revoke select on table "public"."error_logs" from "service_role";

revoke trigger on table "public"."error_logs" from "service_role";

revoke truncate on table "public"."error_logs" from "service_role";

revoke update on table "public"."error_logs" from "service_role";

revoke delete on table "public"."notification_campaigns" from "anon";

revoke insert on table "public"."notification_campaigns" from "anon";

revoke references on table "public"."notification_campaigns" from "anon";

revoke select on table "public"."notification_campaigns" from "anon";

revoke trigger on table "public"."notification_campaigns" from "anon";

revoke truncate on table "public"."notification_campaigns" from "anon";

revoke update on table "public"."notification_campaigns" from "anon";

revoke delete on table "public"."notification_campaigns" from "authenticated";

revoke insert on table "public"."notification_campaigns" from "authenticated";

revoke references on table "public"."notification_campaigns" from "authenticated";

revoke select on table "public"."notification_campaigns" from "authenticated";

revoke trigger on table "public"."notification_campaigns" from "authenticated";

revoke truncate on table "public"."notification_campaigns" from "authenticated";

revoke update on table "public"."notification_campaigns" from "authenticated";

revoke delete on table "public"."notification_campaigns" from "service_role";

revoke insert on table "public"."notification_campaigns" from "service_role";

revoke references on table "public"."notification_campaigns" from "service_role";

revoke select on table "public"."notification_campaigns" from "service_role";

revoke trigger on table "public"."notification_campaigns" from "service_role";

revoke truncate on table "public"."notification_campaigns" from "service_role";

revoke update on table "public"."notification_campaigns" from "service_role";

revoke delete on table "public"."notification_events" from "anon";

revoke insert on table "public"."notification_events" from "anon";

revoke references on table "public"."notification_events" from "anon";

revoke select on table "public"."notification_events" from "anon";

revoke trigger on table "public"."notification_events" from "anon";

revoke truncate on table "public"."notification_events" from "anon";

revoke update on table "public"."notification_events" from "anon";

revoke delete on table "public"."notification_events" from "authenticated";

revoke insert on table "public"."notification_events" from "authenticated";

revoke references on table "public"."notification_events" from "authenticated";

revoke select on table "public"."notification_events" from "authenticated";

revoke trigger on table "public"."notification_events" from "authenticated";

revoke truncate on table "public"."notification_events" from "authenticated";

revoke update on table "public"."notification_events" from "authenticated";

revoke delete on table "public"."notification_events" from "service_role";

revoke insert on table "public"."notification_events" from "service_role";

revoke references on table "public"."notification_events" from "service_role";

revoke select on table "public"."notification_events" from "service_role";

revoke trigger on table "public"."notification_events" from "service_role";

revoke truncate on table "public"."notification_events" from "service_role";

revoke update on table "public"."notification_events" from "service_role";

revoke delete on table "public"."notification_queue" from "anon";

revoke insert on table "public"."notification_queue" from "anon";

revoke references on table "public"."notification_queue" from "anon";

revoke select on table "public"."notification_queue" from "anon";

revoke trigger on table "public"."notification_queue" from "anon";

revoke truncate on table "public"."notification_queue" from "anon";

revoke update on table "public"."notification_queue" from "anon";

revoke delete on table "public"."notification_queue" from "authenticated";

revoke insert on table "public"."notification_queue" from "authenticated";

revoke references on table "public"."notification_queue" from "authenticated";

revoke select on table "public"."notification_queue" from "authenticated";

revoke trigger on table "public"."notification_queue" from "authenticated";

revoke truncate on table "public"."notification_queue" from "authenticated";

revoke update on table "public"."notification_queue" from "authenticated";

revoke delete on table "public"."notification_queue" from "service_role";

revoke insert on table "public"."notification_queue" from "service_role";

revoke references on table "public"."notification_queue" from "service_role";

revoke select on table "public"."notification_queue" from "service_role";

revoke trigger on table "public"."notification_queue" from "service_role";

revoke truncate on table "public"."notification_queue" from "service_role";

revoke update on table "public"."notification_queue" from "service_role";

revoke delete on table "public"."notification_templates" from "anon";

revoke insert on table "public"."notification_templates" from "anon";

revoke references on table "public"."notification_templates" from "anon";

revoke select on table "public"."notification_templates" from "anon";

revoke trigger on table "public"."notification_templates" from "anon";

revoke truncate on table "public"."notification_templates" from "anon";

revoke update on table "public"."notification_templates" from "anon";

revoke delete on table "public"."notification_templates" from "authenticated";

revoke insert on table "public"."notification_templates" from "authenticated";

revoke references on table "public"."notification_templates" from "authenticated";

revoke select on table "public"."notification_templates" from "authenticated";

revoke trigger on table "public"."notification_templates" from "authenticated";

revoke truncate on table "public"."notification_templates" from "authenticated";

revoke update on table "public"."notification_templates" from "authenticated";

revoke delete on table "public"."notification_templates" from "service_role";

revoke insert on table "public"."notification_templates" from "service_role";

revoke references on table "public"."notification_templates" from "service_role";

revoke select on table "public"."notification_templates" from "service_role";

revoke trigger on table "public"."notification_templates" from "service_role";

revoke truncate on table "public"."notification_templates" from "service_role";

revoke update on table "public"."notification_templates" from "service_role";

revoke delete on table "public"."performance_metrics" from "anon";

revoke insert on table "public"."performance_metrics" from "anon";

revoke references on table "public"."performance_metrics" from "anon";

revoke select on table "public"."performance_metrics" from "anon";

revoke trigger on table "public"."performance_metrics" from "anon";

revoke truncate on table "public"."performance_metrics" from "anon";

revoke update on table "public"."performance_metrics" from "anon";

revoke delete on table "public"."performance_metrics" from "authenticated";

revoke insert on table "public"."performance_metrics" from "authenticated";

revoke references on table "public"."performance_metrics" from "authenticated";

revoke select on table "public"."performance_metrics" from "authenticated";

revoke trigger on table "public"."performance_metrics" from "authenticated";

revoke truncate on table "public"."performance_metrics" from "authenticated";

revoke update on table "public"."performance_metrics" from "authenticated";

revoke delete on table "public"."performance_metrics" from "service_role";

revoke insert on table "public"."performance_metrics" from "service_role";

revoke references on table "public"."performance_metrics" from "service_role";

revoke select on table "public"."performance_metrics" from "service_role";

revoke trigger on table "public"."performance_metrics" from "service_role";

revoke truncate on table "public"."performance_metrics" from "service_role";

revoke update on table "public"."performance_metrics" from "service_role";

revoke delete on table "public"."search_analytics" from "anon";

revoke insert on table "public"."search_analytics" from "anon";

revoke references on table "public"."search_analytics" from "anon";

revoke select on table "public"."search_analytics" from "anon";

revoke trigger on table "public"."search_analytics" from "anon";

revoke truncate on table "public"."search_analytics" from "anon";

revoke update on table "public"."search_analytics" from "anon";

revoke delete on table "public"."search_analytics" from "authenticated";

revoke insert on table "public"."search_analytics" from "authenticated";

revoke references on table "public"."search_analytics" from "authenticated";

revoke select on table "public"."search_analytics" from "authenticated";

revoke trigger on table "public"."search_analytics" from "authenticated";

revoke truncate on table "public"."search_analytics" from "authenticated";

revoke update on table "public"."search_analytics" from "authenticated";

revoke delete on table "public"."search_analytics" from "service_role";

revoke insert on table "public"."search_analytics" from "service_role";

revoke references on table "public"."search_analytics" from "service_role";

revoke select on table "public"."search_analytics" from "service_role";

revoke trigger on table "public"."search_analytics" from "service_role";

revoke truncate on table "public"."search_analytics" from "service_role";

revoke update on table "public"."search_analytics" from "service_role";

revoke delete on table "public"."template_analytics" from "anon";

revoke insert on table "public"."template_analytics" from "anon";

revoke references on table "public"."template_analytics" from "anon";

revoke select on table "public"."template_analytics" from "anon";

revoke trigger on table "public"."template_analytics" from "anon";

revoke truncate on table "public"."template_analytics" from "anon";

revoke update on table "public"."template_analytics" from "anon";

revoke delete on table "public"."template_analytics" from "authenticated";

revoke insert on table "public"."template_analytics" from "authenticated";

revoke references on table "public"."template_analytics" from "authenticated";

revoke select on table "public"."template_analytics" from "authenticated";

revoke trigger on table "public"."template_analytics" from "authenticated";

revoke truncate on table "public"."template_analytics" from "authenticated";

revoke update on table "public"."template_analytics" from "authenticated";

revoke delete on table "public"."template_analytics" from "service_role";

revoke insert on table "public"."template_analytics" from "service_role";

revoke references on table "public"."template_analytics" from "service_role";

revoke select on table "public"."template_analytics" from "service_role";

revoke trigger on table "public"."template_analytics" from "service_role";

revoke truncate on table "public"."template_analytics" from "service_role";

revoke update on table "public"."template_analytics" from "service_role";

revoke delete on table "public"."user_behavior_stats" from "anon";

revoke insert on table "public"."user_behavior_stats" from "anon";

revoke references on table "public"."user_behavior_stats" from "anon";

revoke select on table "public"."user_behavior_stats" from "anon";

revoke trigger on table "public"."user_behavior_stats" from "anon";

revoke truncate on table "public"."user_behavior_stats" from "anon";

revoke update on table "public"."user_behavior_stats" from "anon";

revoke delete on table "public"."user_behavior_stats" from "authenticated";

revoke insert on table "public"."user_behavior_stats" from "authenticated";

revoke references on table "public"."user_behavior_stats" from "authenticated";

revoke select on table "public"."user_behavior_stats" from "authenticated";

revoke trigger on table "public"."user_behavior_stats" from "authenticated";

revoke truncate on table "public"."user_behavior_stats" from "authenticated";

revoke update on table "public"."user_behavior_stats" from "authenticated";

revoke delete on table "public"."user_behavior_stats" from "service_role";

revoke insert on table "public"."user_behavior_stats" from "service_role";

revoke references on table "public"."user_behavior_stats" from "service_role";

revoke select on table "public"."user_behavior_stats" from "service_role";

revoke trigger on table "public"."user_behavior_stats" from "service_role";

revoke truncate on table "public"."user_behavior_stats" from "service_role";

revoke update on table "public"."user_behavior_stats" from "service_role";

alter table "public"."error_logs" drop constraint "error_logs_session_id_fkey";

alter table "public"."error_logs" drop constraint "error_logs_user_id_fkey";

alter table "public"."notification_campaigns" drop constraint "notification_campaigns_status_check";

alter table "public"."notification_events" drop constraint "notification_events_campaign_id_fkey";

alter table "public"."notification_events" drop constraint "notification_events_event_type_check";

alter table "public"."notification_events" drop constraint "notification_events_user_id_fkey";

alter table "public"."notification_queue" drop constraint "notification_queue_campaign_id_fkey";

alter table "public"."notification_queue" drop constraint "notification_queue_status_check";

alter table "public"."notification_queue" drop constraint "notification_queue_user_id_fkey";

alter table "public"."performance_metrics" drop constraint "performance_metrics_session_id_fkey";

alter table "public"."performance_metrics" drop constraint "performance_metrics_user_id_fkey";

alter table "public"."search_analytics" drop constraint "search_analytics_session_id_fkey";

alter table "public"."search_analytics" drop constraint "search_analytics_user_id_fkey";

alter table "public"."template_analytics" drop constraint "template_analytics_template_id_date_key";

alter table "public"."user_behavior_stats" drop constraint "user_behavior_stats_user_id_date_key";

alter table "public"."user_behavior_stats" drop constraint "user_behavior_stats_user_id_fkey";

alter table "public"."pro_waitlist" drop constraint "pro_waitlist_user_id_fkey";

drop view if exists "public"."daily_notification_analytics";

drop view if exists "public"."daily_platform_stats";

drop view if exists "public"."notification_stats";

drop view if exists "public"."policy_coverage_audit";

drop view if exists "public"."popular_templates";

drop function if exists "public"."process_scheduled_notifications"();

drop function if exists "public"."update_daily_user_stats"(p_user_id uuid, p_date date);

drop function if exists "public"."update_template_stats"(p_template_id text, p_template_title text, p_template_category text, p_date date);

drop view if exists "public"."user_activity_summary";

drop view if exists "public"."user_notification_engagement";

alter table "public"."error_logs" drop constraint "error_logs_pkey";

alter table "public"."notification_campaigns" drop constraint "notification_campaigns_pkey";

alter table "public"."notification_events" drop constraint "notification_events_pkey";

alter table "public"."notification_queue" drop constraint "notification_queue_pkey";

alter table "public"."notification_templates" drop constraint "notification_templates_pkey";

alter table "public"."performance_metrics" drop constraint "performance_metrics_pkey";

alter table "public"."search_analytics" drop constraint "search_analytics_pkey";

alter table "public"."template_analytics" drop constraint "template_analytics_pkey";

alter table "public"."user_behavior_stats" drop constraint "user_behavior_stats_pkey";

drop index if exists "public"."error_logs_pkey";

drop index if exists "public"."idx_analytics_events_timestamp";

drop index if exists "public"."idx_error_logs_timestamp";

drop index if exists "public"."idx_notification_campaigns_scheduled_at";

drop index if exists "public"."idx_notification_campaigns_status";

drop index if exists "public"."idx_notification_events_timestamp";

drop index if exists "public"."idx_notification_events_user_id";

drop index if exists "public"."idx_notification_queue_scheduled_for";

drop index if exists "public"."idx_notification_queue_status_scheduled";

drop index if exists "public"."idx_notification_queue_user_id";

drop index if exists "public"."idx_performance_metrics_timestamp";

drop index if exists "public"."idx_push_subscriptions_user_active";

drop index if exists "public"."idx_search_analytics_timestamp";

drop index if exists "public"."idx_search_analytics_timestamp_only";

drop index if exists "public"."idx_user_behavior_stats_user_id";

drop index if exists "public"."idx_user_sessions_start_time";

drop index if exists "public"."notification_campaigns_pkey";

drop index if exists "public"."notification_events_pkey";

drop index if exists "public"."notification_queue_pkey";

drop index if exists "public"."notification_templates_pkey";

drop index if exists "public"."performance_metrics_pkey";

drop index if exists "public"."search_analytics_pkey";

drop index if exists "public"."template_analytics_pkey";

drop index if exists "public"."template_analytics_template_id_date_key";

drop index if exists "public"."user_behavior_stats_pkey";

drop index if exists "public"."user_behavior_stats_user_id_date_key";

drop table "public"."error_logs";

drop table "public"."notification_campaigns";

drop table "public"."notification_events";

drop table "public"."notification_queue";

drop table "public"."notification_templates";

drop table "public"."performance_metrics";

drop table "public"."search_analytics";

drop table "public"."template_analytics";

drop table "public"."user_behavior_stats";

create table "public"."analysis_cache" (
    "cache_key" text not null,
    "data" jsonb not null,
    "created_at" timestamp with time zone not null default now(),
    "expires_at" timestamp with time zone not null
);


alter table "public"."analysis_cache" enable row level security;

create table "public"."analysis_job_status" (
    "correlation_id" text not null,
    "status" text not null,
    "details" jsonb,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."analysis_job_status" enable row level security;

create table "public"."blog_posts" (
    "id" uuid not null default gen_random_uuid(),
    "slug" text not null,
    "title" text not null,
    "content" text,
    "updated_at" timestamp with time zone default now()
);


alter table "public"."blog_posts" enable row level security;

create table "public"."document_templates" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone default now(),
    "name" text not null,
    "description" text,
    "category" text,
    "content_template" text,
    "is_premium" boolean default false
);


alter table "public"."document_templates" enable row level security;

create table "public"."law_firm_profiles" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "name" text not null,
    "slug" text not null,
    "city" text not null,
    "logo_url" text,
    "website" text,
    "phone" text,
    "email" text,
    "address" text,
    "description" text,
    "specialties" text[],
    "status" firm_status not null default 'pending'::firm_status
);


alter table "public"."law_firm_profiles" enable row level security;

create table "public"."rtbf_requests" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "status" text not null default 'received'::text,
    "details" jsonb,
    "requested_at" timestamp with time zone not null default now(),
    "processed_at" timestamp with time zone
);


alter table "public"."rtbf_requests" enable row level security;

create table "public"."user_consents" (
    "user_id" uuid not null,
    "consent_analytics" boolean not null default true,
    "consent_ai_improvement" boolean not null default false,
    "consent_marketing" boolean not null default false,
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."user_consents" enable row level security;

create table "public"."user_generated_documents" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone default now(),
    "user_id" uuid not null,
    "template_id" uuid not null,
    "generated_content" text
);


alter table "public"."user_generated_documents" enable row level security;

alter table "public"."pro_waitlist" alter column "created_at" set not null;

alter table "public"."pro_waitlist" alter column "id" drop default;

alter table "public"."pro_waitlist" alter column "id" add generated by default as identity;

alter table "public"."pro_waitlist" alter column "id" set data type bigint using "id"::bigint;

alter table "public"."pro_waitlist" alter column "user_id" set default gen_random_uuid();

alter table "public"."profiles" drop column "has_completed_onboarding";

alter table "public"."profiles" add column "role" text not null default 'user'::text;

CREATE UNIQUE INDEX analysis_cache_pkey ON public.analysis_cache USING btree (cache_key);

CREATE UNIQUE INDEX analysis_job_status_pkey ON public.analysis_job_status USING btree (correlation_id);

CREATE UNIQUE INDEX blog_posts_pkey ON public.blog_posts USING btree (id);

CREATE UNIQUE INDEX blog_posts_slug_key ON public.blog_posts USING btree (slug);

CREATE UNIQUE INDEX document_templates_pkey ON public.document_templates USING btree (id);

CREATE INDEX idx_analysis_cache_expires_at ON public.analysis_cache USING btree (expires_at);

CREATE INDEX idx_analysis_job_status_updated_at ON public.analysis_job_status USING btree (updated_at);

CREATE INDEX idx_document_templates_category ON public.document_templates USING btree (category);

CREATE INDEX idx_document_templates_is_premium ON public.document_templates USING btree (is_premium);

CREATE INDEX idx_push_subscriptions_is_active ON public.push_subscriptions USING btree (is_active);

CREATE INDEX idx_user_generated_documents_template_id ON public.user_generated_documents USING btree (template_id);

CREATE INDEX idx_user_generated_documents_user_id ON public.user_generated_documents USING btree (user_id);

CREATE INDEX idx_user_sessions_session_id ON public.user_sessions USING btree (session_id);

CREATE UNIQUE INDEX law_firm_profiles_pkey ON public.law_firm_profiles USING btree (id);

CREATE UNIQUE INDEX law_firm_profiles_slug_key ON public.law_firm_profiles USING btree (slug);

CREATE UNIQUE INDEX rtbf_requests_pkey ON public.rtbf_requests USING btree (id);

CREATE UNIQUE INDEX user_consents_pkey ON public.user_consents USING btree (user_id);

CREATE UNIQUE INDEX user_generated_documents_pkey ON public.user_generated_documents USING btree (id);

alter table "public"."analysis_cache" add constraint "analysis_cache_pkey" PRIMARY KEY using index "analysis_cache_pkey";

alter table "public"."analysis_job_status" add constraint "analysis_job_status_pkey" PRIMARY KEY using index "analysis_job_status_pkey";

alter table "public"."blog_posts" add constraint "blog_posts_pkey" PRIMARY KEY using index "blog_posts_pkey";

alter table "public"."document_templates" add constraint "document_templates_pkey" PRIMARY KEY using index "document_templates_pkey";

alter table "public"."law_firm_profiles" add constraint "law_firm_profiles_pkey" PRIMARY KEY using index "law_firm_profiles_pkey";

alter table "public"."rtbf_requests" add constraint "rtbf_requests_pkey" PRIMARY KEY using index "rtbf_requests_pkey";

alter table "public"."user_consents" add constraint "user_consents_pkey" PRIMARY KEY using index "user_consents_pkey";

alter table "public"."user_generated_documents" add constraint "user_generated_documents_pkey" PRIMARY KEY using index "user_generated_documents_pkey";

alter table "public"."blog_posts" add constraint "blog_posts_slug_key" UNIQUE using index "blog_posts_slug_key";

alter table "public"."documents" add constraint "fk_documents_user_id" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."documents" validate constraint "fk_documents_user_id";

alter table "public"."law_firm_profiles" add constraint "law_firm_profiles_slug_key" UNIQUE using index "law_firm_profiles_slug_key";

alter table "public"."user_consents" add constraint "user_consents_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_consents" validate constraint "user_consents_user_id_fkey";

alter table "public"."user_generated_documents" add constraint "user_generated_documents_template_id_fkey" FOREIGN KEY (template_id) REFERENCES document_templates(id) ON DELETE CASCADE not valid;

alter table "public"."user_generated_documents" validate constraint "user_generated_documents_template_id_fkey";

alter table "public"."user_generated_documents" add constraint "user_generated_documents_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_generated_documents" validate constraint "user_generated_documents_user_id_fkey";

alter table "public"."pro_waitlist" add constraint "pro_waitlist_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."pro_waitlist" validate constraint "pro_waitlist_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.decrement_credit(user_uuid uuid, amount integer DEFAULT 1)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
    current_credits INTEGER;
BEGIN
    SELECT credits INTO current_credits 
    FROM public.profiles 
    WHERE id = user_uuid;
    
    IF current_credits IS NULL THEN
        RETURN FALSE;
    END IF;
    
    IF current_credits < amount THEN
        RETURN FALSE;
    END IF;
    
    UPDATE public.profiles 
    SET credits = credits - amount
    WHERE id = user_uuid;
    
    RETURN TRUE;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.purge_old_analytics()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
    DELETE FROM public.analytics_events 
    WHERE created_at < NOW() - INTERVAL '90 days';
    
    DELETE FROM public.error_logs 
    WHERE created_at < NOW() - INTERVAL '30 days';
    
    DELETE FROM public.performance_metrics 
    WHERE created_at < NOW() - INTERVAL '30 days';
    
    DELETE FROM public.user_sessions 
    WHERE last_activity < NOW() - INTERVAL '180 days';
    
    RAISE NOTICE 'Old analytics data purged';
END;
$function$
;

CREATE OR REPLACE FUNCTION public.purge_old_analytics(p_days integer DEFAULT 365)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  DELETE FROM analytics_events WHERE timestamp < NOW() - (p_days || ' days')::interval;
  DELETE FROM user_sessions WHERE start_time < NOW() - (p_days || ' days')::interval;
  -- Optionally: performance_metrics, search_analytics, template_analytics views source tables are handled by events
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_updated_at_column_job()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
    -- Cleanup old sessions
    DELETE FROM public.user_sessions 
    WHERE last_activity < NOW() - INTERVAL '30 days';
    
    -- Cleanup old analytics
    DELETE FROM public.analytics_events 
    WHERE created_at < NOW() - INTERVAL '90 days';
    
    RAISE NOTICE 'Cleanup job completed';
END;
$function$
;

CREATE OR REPLACE FUNCTION public.create_default_notification_preferences()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  insert into public.user_notification_preferences (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (
    id, email, full_name, phone, birth_date, reference_code,
    marketing_consent, email_consent, sms_consent, credits
  )
  VALUES (
    NEW.id, NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    CASE 
      WHEN NEW.raw_user_meta_data->>'birth_date' IS NOT NULL 
           AND NEW.raw_user_meta_data->>'birth_date' != ''
           AND NEW.raw_user_meta_data->>'birth_date' != 'undefined'
           AND NEW.raw_user_meta_data->>'birth_date' ~ '^\d{4}-\d{2}-\d{2}$'
      THEN (NEW.raw_user_meta_data->>'birth_date')::DATE 
      ELSE NULL 
    END,
    COALESCE(NEW.raw_user_meta_data->>'reference_code', ''),
    COALESCE((NEW.raw_user_meta_data->>'marketing_consent')::BOOLEAN, false),
    COALESCE((NEW.raw_user_meta_data->>'email_consent')::BOOLEAN, false),
    COALESCE((NEW.raw_user_meta_data->>'sms_consent')::BOOLEAN, false),
    3
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    birth_date = EXCLUDED.birth_date,
    reference_code = EXCLUDED.reference_code,
    marketing_consent = EXCLUDED.marketing_consent,
    email_consent = EXCLUDED.email_consent,
    sms_consent = EXCLUDED.sms_consent,
    updated_at = NOW();
  
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$
;

grant delete on table "public"."analysis_cache" to "anon";

grant insert on table "public"."analysis_cache" to "anon";

grant references on table "public"."analysis_cache" to "anon";

grant select on table "public"."analysis_cache" to "anon";

grant trigger on table "public"."analysis_cache" to "anon";

grant truncate on table "public"."analysis_cache" to "anon";

grant update on table "public"."analysis_cache" to "anon";

grant delete on table "public"."analysis_cache" to "authenticated";

grant insert on table "public"."analysis_cache" to "authenticated";

grant references on table "public"."analysis_cache" to "authenticated";

grant select on table "public"."analysis_cache" to "authenticated";

grant trigger on table "public"."analysis_cache" to "authenticated";

grant truncate on table "public"."analysis_cache" to "authenticated";

grant update on table "public"."analysis_cache" to "authenticated";

grant delete on table "public"."analysis_cache" to "service_role";

grant insert on table "public"."analysis_cache" to "service_role";

grant references on table "public"."analysis_cache" to "service_role";

grant select on table "public"."analysis_cache" to "service_role";

grant trigger on table "public"."analysis_cache" to "service_role";

grant truncate on table "public"."analysis_cache" to "service_role";

grant update on table "public"."analysis_cache" to "service_role";

grant delete on table "public"."analysis_job_status" to "anon";

grant insert on table "public"."analysis_job_status" to "anon";

grant references on table "public"."analysis_job_status" to "anon";

grant select on table "public"."analysis_job_status" to "anon";

grant trigger on table "public"."analysis_job_status" to "anon";

grant truncate on table "public"."analysis_job_status" to "anon";

grant update on table "public"."analysis_job_status" to "anon";

grant delete on table "public"."analysis_job_status" to "authenticated";

grant insert on table "public"."analysis_job_status" to "authenticated";

grant references on table "public"."analysis_job_status" to "authenticated";

grant select on table "public"."analysis_job_status" to "authenticated";

grant trigger on table "public"."analysis_job_status" to "authenticated";

grant truncate on table "public"."analysis_job_status" to "authenticated";

grant update on table "public"."analysis_job_status" to "authenticated";

grant delete on table "public"."analysis_job_status" to "service_role";

grant insert on table "public"."analysis_job_status" to "service_role";

grant references on table "public"."analysis_job_status" to "service_role";

grant select on table "public"."analysis_job_status" to "service_role";

grant trigger on table "public"."analysis_job_status" to "service_role";

grant truncate on table "public"."analysis_job_status" to "service_role";

grant update on table "public"."analysis_job_status" to "service_role";

grant delete on table "public"."blog_posts" to "anon";

grant insert on table "public"."blog_posts" to "anon";

grant references on table "public"."blog_posts" to "anon";

grant select on table "public"."blog_posts" to "anon";

grant trigger on table "public"."blog_posts" to "anon";

grant truncate on table "public"."blog_posts" to "anon";

grant update on table "public"."blog_posts" to "anon";

grant delete on table "public"."blog_posts" to "authenticated";

grant insert on table "public"."blog_posts" to "authenticated";

grant references on table "public"."blog_posts" to "authenticated";

grant select on table "public"."blog_posts" to "authenticated";

grant trigger on table "public"."blog_posts" to "authenticated";

grant truncate on table "public"."blog_posts" to "authenticated";

grant update on table "public"."blog_posts" to "authenticated";

grant delete on table "public"."blog_posts" to "service_role";

grant insert on table "public"."blog_posts" to "service_role";

grant references on table "public"."blog_posts" to "service_role";

grant select on table "public"."blog_posts" to "service_role";

grant trigger on table "public"."blog_posts" to "service_role";

grant truncate on table "public"."blog_posts" to "service_role";

grant update on table "public"."blog_posts" to "service_role";

grant delete on table "public"."document_templates" to "anon";

grant insert on table "public"."document_templates" to "anon";

grant references on table "public"."document_templates" to "anon";

grant select on table "public"."document_templates" to "anon";

grant trigger on table "public"."document_templates" to "anon";

grant truncate on table "public"."document_templates" to "anon";

grant update on table "public"."document_templates" to "anon";

grant delete on table "public"."document_templates" to "authenticated";

grant insert on table "public"."document_templates" to "authenticated";

grant references on table "public"."document_templates" to "authenticated";

grant select on table "public"."document_templates" to "authenticated";

grant trigger on table "public"."document_templates" to "authenticated";

grant truncate on table "public"."document_templates" to "authenticated";

grant update on table "public"."document_templates" to "authenticated";

grant delete on table "public"."document_templates" to "service_role";

grant insert on table "public"."document_templates" to "service_role";

grant references on table "public"."document_templates" to "service_role";

grant select on table "public"."document_templates" to "service_role";

grant trigger on table "public"."document_templates" to "service_role";

grant truncate on table "public"."document_templates" to "service_role";

grant update on table "public"."document_templates" to "service_role";

grant delete on table "public"."law_firm_profiles" to "anon";

grant insert on table "public"."law_firm_profiles" to "anon";

grant references on table "public"."law_firm_profiles" to "anon";

grant select on table "public"."law_firm_profiles" to "anon";

grant trigger on table "public"."law_firm_profiles" to "anon";

grant truncate on table "public"."law_firm_profiles" to "anon";

grant update on table "public"."law_firm_profiles" to "anon";

grant delete on table "public"."law_firm_profiles" to "authenticated";

grant insert on table "public"."law_firm_profiles" to "authenticated";

grant references on table "public"."law_firm_profiles" to "authenticated";

grant select on table "public"."law_firm_profiles" to "authenticated";

grant trigger on table "public"."law_firm_profiles" to "authenticated";

grant truncate on table "public"."law_firm_profiles" to "authenticated";

grant update on table "public"."law_firm_profiles" to "authenticated";

grant delete on table "public"."law_firm_profiles" to "service_role";

grant insert on table "public"."law_firm_profiles" to "service_role";

grant references on table "public"."law_firm_profiles" to "service_role";

grant select on table "public"."law_firm_profiles" to "service_role";

grant trigger on table "public"."law_firm_profiles" to "service_role";

grant truncate on table "public"."law_firm_profiles" to "service_role";

grant update on table "public"."law_firm_profiles" to "service_role";

grant delete on table "public"."rtbf_requests" to "anon";

grant insert on table "public"."rtbf_requests" to "anon";

grant references on table "public"."rtbf_requests" to "anon";

grant select on table "public"."rtbf_requests" to "anon";

grant trigger on table "public"."rtbf_requests" to "anon";

grant truncate on table "public"."rtbf_requests" to "anon";

grant update on table "public"."rtbf_requests" to "anon";

grant delete on table "public"."rtbf_requests" to "authenticated";

grant insert on table "public"."rtbf_requests" to "authenticated";

grant references on table "public"."rtbf_requests" to "authenticated";

grant select on table "public"."rtbf_requests" to "authenticated";

grant trigger on table "public"."rtbf_requests" to "authenticated";

grant truncate on table "public"."rtbf_requests" to "authenticated";

grant update on table "public"."rtbf_requests" to "authenticated";

grant delete on table "public"."rtbf_requests" to "service_role";

grant insert on table "public"."rtbf_requests" to "service_role";

grant references on table "public"."rtbf_requests" to "service_role";

grant select on table "public"."rtbf_requests" to "service_role";

grant trigger on table "public"."rtbf_requests" to "service_role";

grant truncate on table "public"."rtbf_requests" to "service_role";

grant update on table "public"."rtbf_requests" to "service_role";

grant delete on table "public"."user_consents" to "anon";

grant insert on table "public"."user_consents" to "anon";

grant references on table "public"."user_consents" to "anon";

grant select on table "public"."user_consents" to "anon";

grant trigger on table "public"."user_consents" to "anon";

grant truncate on table "public"."user_consents" to "anon";

grant update on table "public"."user_consents" to "anon";

grant delete on table "public"."user_consents" to "authenticated";

grant insert on table "public"."user_consents" to "authenticated";

grant references on table "public"."user_consents" to "authenticated";

grant select on table "public"."user_consents" to "authenticated";

grant trigger on table "public"."user_consents" to "authenticated";

grant truncate on table "public"."user_consents" to "authenticated";

grant update on table "public"."user_consents" to "authenticated";

grant delete on table "public"."user_consents" to "service_role";

grant insert on table "public"."user_consents" to "service_role";

grant references on table "public"."user_consents" to "service_role";

grant select on table "public"."user_consents" to "service_role";

grant trigger on table "public"."user_consents" to "service_role";

grant truncate on table "public"."user_consents" to "service_role";

grant update on table "public"."user_consents" to "service_role";

grant delete on table "public"."user_generated_documents" to "anon";

grant insert on table "public"."user_generated_documents" to "anon";

grant references on table "public"."user_generated_documents" to "anon";

grant select on table "public"."user_generated_documents" to "anon";

grant trigger on table "public"."user_generated_documents" to "anon";

grant truncate on table "public"."user_generated_documents" to "anon";

grant update on table "public"."user_generated_documents" to "anon";

grant delete on table "public"."user_generated_documents" to "authenticated";

grant insert on table "public"."user_generated_documents" to "authenticated";

grant references on table "public"."user_generated_documents" to "authenticated";

grant select on table "public"."user_generated_documents" to "authenticated";

grant trigger on table "public"."user_generated_documents" to "authenticated";

grant truncate on table "public"."user_generated_documents" to "authenticated";

grant update on table "public"."user_generated_documents" to "authenticated";

grant delete on table "public"."user_generated_documents" to "service_role";

grant insert on table "public"."user_generated_documents" to "service_role";

grant references on table "public"."user_generated_documents" to "service_role";

grant select on table "public"."user_generated_documents" to "service_role";

grant trigger on table "public"."user_generated_documents" to "service_role";

grant truncate on table "public"."user_generated_documents" to "service_role";

grant update on table "public"."user_generated_documents" to "service_role";

create policy "Service can manage cache"
on "public"."analysis_cache"
as permissive
for all
to public
using (true)
with check (true);


create policy "Anyone can read job status"
on "public"."analysis_job_status"
as permissive
for select
to public
using (true);


create policy "Service can manage job status"
on "public"."analysis_job_status"
as permissive
for all
to public
using (true)
with check (true);


create policy "Allow anon read"
on "public"."blog_posts"
as permissive
for select
to public
using (true);


create policy "Allow authenticated users to read templates"
on "public"."document_templates"
as permissive
for select
to authenticated
using (true);


create policy "Admin can view all documents for analytics"
on "public"."documents"
as permissive
for select
to public
using ((auth.email() = 'info@artiklo.legal'::text));


create policy "Kullanicilar kendi belgelerini gorebilir"
on "public"."documents"
as permissive
for select
to authenticated
using ((auth.uid() = user_id));


create policy "Partners can view their own profile"
on "public"."law_firm_profiles"
as permissive
for select
to public
using ((auth.uid() = id));


create policy "Public can view approved law firms"
on "public"."law_firm_profiles"
as permissive
for select
to public
using ((status = 'approved'::firm_status));


create policy "Admin can view all profiles for analytics"
on "public"."profiles"
as permissive
for select
to public
using ((auth.email() = 'info@artiklo.legal'::text));


create policy "Service can manage rtbf"
on "public"."rtbf_requests"
as permissive
for all
to public
using (true)
with check (true);


create policy "Users can view own rtbf requests"
on "public"."rtbf_requests"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "Users can update own consents"
on "public"."user_consents"
as permissive
for update
to public
using ((auth.uid() = user_id));


create policy "Users can upsert own consents"
on "public"."user_consents"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Users can view own consents"
on "public"."user_consents"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "Allow users to manage their own documents"
on "public"."user_generated_documents"
as permissive
for all
to authenticated
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));


create policy "Users can delete own generated documents"
on "public"."user_generated_documents"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "Users can insert own generated documents"
on "public"."user_generated_documents"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Users can update own generated documents"
on "public"."user_generated_documents"
as permissive
for update
to public
using ((auth.uid() = user_id));


create policy "Users can view own generated documents"
on "public"."user_generated_documents"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "Users can insert own events"
on "public"."analytics_events"
as permissive
for insert
to public
with check (((auth.uid() = user_id) OR (user_id IS NULL)));


create policy "Users can view their own documents"
on "public"."documents"
as permissive
for select
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Users can view their own profile"
on "public"."profiles"
as permissive
for select
to public
using (((auth.uid())::text = (id)::text));


create policy "Users can insert own sessions"
on "public"."user_sessions"
as permissive
for insert
to public
with check (((auth.uid() = user_id) OR (user_id IS NULL)));


create policy "Users can update own sessions"
on "public"."user_sessions"
as permissive
for update
to public
using (((auth.uid() = user_id) OR (user_id IS NULL)));


CREATE TRIGGER update_analysis_job_status_updated_at BEFORE UPDATE ON public.analysis_job_status FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();



