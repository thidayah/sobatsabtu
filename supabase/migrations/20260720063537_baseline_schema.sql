-- Baseline schema for sobatsabtu, reverse-engineered from the live "Share Your
-- Distance" Supabase project (biyurtytnwlmxuninybb) on 2026-07-20 via pg_dump.
--
-- This project's database is shared with other, unrelated apps (their tables
-- are intentionally excluded here). Only the four ss_* tables below belong to
-- sobatsabtu.
--
-- All four tables have Row Level Security enabled with NO policies attached,
-- which means they're completely inaccessible except via the service_role
-- key (which bypasses RLS) — matching how this app only ever talks to
-- Supabase through the server-side service role client, never the anon key
-- from the browser.

-- =========================================================================
-- ss_events
-- =========================================================================

CREATE TABLE public.ss_events (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    descriptions text DEFAULT ''::text,
    slug character varying(255) NOT NULL,
    image_url text DEFAULT ''::text,
    date date NOT NULL,
    "time" time without time zone NOT NULL,
    location text NOT NULL,
    current_participants integer DEFAULT 0,
    max_participants integer NOT NULL,
    type character varying(100) NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    location_url text DEFAULT ''::text,
    external_url text DEFAULT ''::text,
    CONSTRAINT ss_events_pkey PRIMARY KEY (id),
    CONSTRAINT ss_events_slug_key UNIQUE (slug)
);

CREATE INDEX idx_ss_events_date ON public.ss_events USING btree (date);
CREATE INDEX idx_ss_events_date_active ON public.ss_events USING btree (date, is_active);
CREATE INDEX idx_ss_events_is_active ON public.ss_events USING btree (is_active);
CREATE INDEX idx_ss_events_slug ON public.ss_events USING btree (slug);
CREATE INDEX idx_ss_events_type ON public.ss_events USING btree (type);

ALTER TABLE public.ss_events ENABLE ROW LEVEL SECURITY;

-- =========================================================================
-- ss_members
-- =========================================================================

CREATE TABLE public.ss_members (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    full_name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    ig_username character varying(100),
    gender character varying(20),
    emergency_contact_name character varying(255) NOT NULL,
    emergency_contact_phone character varying(50) NOT NULL,
    medical_notes text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT ss_members_pkey PRIMARY KEY (id),
    CONSTRAINT ss_members_email_key UNIQUE (email)
);

CREATE INDEX idx_ss_members_email ON public.ss_members USING btree (email);
CREATE INDEX idx_ss_members_full_name ON public.ss_members USING btree (full_name);
CREATE INDEX idx_ss_members_ig_username ON public.ss_members USING btree (ig_username);
CREATE INDEX idx_ss_members_is_active ON public.ss_members USING btree (is_active);

ALTER TABLE public.ss_members ENABLE ROW LEVEL SECURITY;

-- =========================================================================
-- ss_registrations
-- =========================================================================

CREATE TABLE public.ss_registrations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    event_id uuid NOT NULL,
    member_id uuid NOT NULL,
    code character varying(50) NOT NULL,
    status character varying(50) DEFAULT 'pending'::character varying,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    is_attendance boolean DEFAULT false,
    CONSTRAINT ss_registrations_pkey PRIMARY KEY (id),
    CONSTRAINT ss_registrations_code_key UNIQUE (code),
    CONSTRAINT ss_registrations_status_check CHECK (
        ((status)::text = ANY ((ARRAY['pending'::character varying, 'confirmed'::character varying, 'cancelled'::character varying, 'waiting'::character varying])::text[]))
    ),
    CONSTRAINT ss_registrations_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.ss_events(id) ON DELETE CASCADE,
    CONSTRAINT ss_registrations_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.ss_members(id) ON DELETE CASCADE
);

CREATE INDEX idx_ss_registrations_code ON public.ss_registrations USING btree (code);
CREATE INDEX idx_ss_registrations_event_id ON public.ss_registrations USING btree (event_id);
CREATE INDEX idx_ss_registrations_member_id ON public.ss_registrations USING btree (member_id);
CREATE INDEX idx_ss_registrations_status ON public.ss_registrations USING btree (status);
CREATE INDEX idx_ss_registrations_event_status ON public.ss_registrations USING btree (event_id, status);

-- Enforces "one active (pending/confirmed) registration per member per event"
-- at the database level, independent of the application-level check in
-- POST /api/registrations.
CREATE UNIQUE INDEX idx_ss_registrations_event_member ON public.ss_registrations USING btree (event_id, member_id)
    WHERE ((status)::text = ANY ((ARRAY['pending'::character varying, 'confirmed'::character varying])::text[]));

ALTER TABLE public.ss_registrations ENABLE ROW LEVEL SECURITY;

-- =========================================================================
-- ss_users (dashboard/admin accounts)
-- =========================================================================

CREATE TABLE public.ss_users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    is_active boolean DEFAULT true,
    last_login timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT ss_users_pkey PRIMARY KEY (id),
    CONSTRAINT ss_users_email_key UNIQUE (email)
);

CREATE INDEX idx_ss_users_email ON public.ss_users USING btree (email);
CREATE INDEX idx_ss_users_is_active ON public.ss_users USING btree (is_active);

ALTER TABLE public.ss_users ENABLE ROW LEVEL SECURITY;
