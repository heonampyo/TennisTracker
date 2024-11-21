--
-- PostgreSQL database dump
--

-- Dumped from database version 16.5
-- Dumped by pg_dump version 16.6 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Record; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."Record" (
    id integer NOT NULL,
    "matchId" text NOT NULL,
    opponent text NOT NULL,
    wins integer NOT NULL,
    losses integer NOT NULL,
    "userId" integer NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Record" OWNER TO "default";

--
-- Name: Record_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public."Record_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Record_id_seq" OWNER TO "default";

--
-- Name: Record_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public."Record_id_seq" OWNED BY public."Record".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."User" OWNER TO "default";

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_id_seq" OWNER TO "default";

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: Record id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Record" ALTER COLUMN id SET DEFAULT nextval('public."Record_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Data for Name: Record; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."Record" (id, "matchId", opponent, wins, losses, "userId", "createdAt") FROM stdin;
55	d7bc7dd4-54fd-46fc-89ce-d4b9f98779f7	김노아	0	1	25	2024-11-02 10:30:40.324+00
56	d7bc7dd4-54fd-46fc-89ce-d4b9f98779f7	김순용	1	0	29	2024-11-02 10:30:40.324+00
57	c81b8b7f-587f-42ca-8238-6b0c43b129b1	조예원	1	0	25	2024-11-02 10:30:56.856+00
58	c81b8b7f-587f-42ca-8238-6b0c43b129b1	김순용	0	1	30	2024-11-02 10:30:56.856+00
59	7b7b4e4a-79f8-41fe-85bf-4e8fda60d049	진현호	1	0	25	2024-11-02 10:31:07.137+00
60	7b7b4e4a-79f8-41fe-85bf-4e8fda60d049	김순용	0	1	31	2024-11-02 10:31:07.137+00
61	5a871605-ae06-4fd4-a6b6-96e11c1940fe	김선재	1	0	32	2024-11-02 10:31:26.806+00
62	5a871605-ae06-4fd4-a6b6-96e11c1940fe	하종철	0	1	33	2024-11-02 10:31:26.806+00
65	5033260d-11b4-412f-b0f0-61b19ec875f0	진현호	1	0	32	2024-11-02 10:31:51.905+00
66	5033260d-11b4-412f-b0f0-61b19ec875f0	하종철	0	1	31	2024-11-02 10:31:51.905+00
67	2f48bd50-76f8-49c3-8b08-571e73eddaca	김노아	0	1	32	2024-11-02 10:31:59.997+00
68	2f48bd50-76f8-49c3-8b08-571e73eddaca	하종철	1	0	29	2024-11-02 10:31:59.997+00
69	36f97e9e-caa0-42ce-abe7-c08b06641450	조예원	1	0	31	2024-11-02 10:32:27.73+00
70	36f97e9e-caa0-42ce-abe7-c08b06641450	진현호	0	1	30	2024-11-02 10:32:27.73+00
71	63f02f22-3c8f-401b-bde2-774179659938	정재영	1	0	34	2024-11-02 10:33:12.76+00
72	63f02f22-3c8f-401b-bde2-774179659938	신대현	0	1	35	2024-11-02 10:33:12.76+00
73	908b28d7-2b32-4470-b920-e74ac2976438	김선재	1	0	30	2024-11-02 10:33:42.964+00
74	908b28d7-2b32-4470-b920-e74ac2976438	조예원	0	1	33	2024-11-02 10:33:42.964+00
75	20bf509a-a63d-4f15-b86a-3af090b78872	김선재	1	0	23	2024-11-02 10:33:56.398+00
76	20bf509a-a63d-4f15-b86a-3af090b78872	김두현	0	1	33	2024-11-02 10:33:56.398+00
77	c2ffcec1-7152-42bf-8db2-0dc0b8800809	조예원	1	0	23	2024-11-02 10:34:05.788+00
78	c2ffcec1-7152-42bf-8db2-0dc0b8800809	김두현	0	1	30	2024-11-02 10:34:05.788+00
79	59ebbff9-7bb5-4f59-a81d-46c3a1782e4f	김두현	1	0	29	2024-11-02 10:34:16.117+00
80	59ebbff9-7bb5-4f59-a81d-46c3a1782e4f	김노아	0	1	23	2024-11-02 10:34:16.117+00
81	edbfcb20-5dee-438c-87e0-9f19281557ba	김두현	1	0	27	2024-11-02 10:34:32.162+00
82	edbfcb20-5dee-438c-87e0-9f19281557ba	허남표	0	1	23	2024-11-02 10:34:32.162+00
83	1ee3c251-f1e0-4ca6-91fd-9abb7b6d176e	김선재	1	0	27	2024-11-02 10:34:43.118+00
84	1ee3c251-f1e0-4ca6-91fd-9abb7b6d176e	허남표	0	1	33	2024-11-02 10:34:43.118+00
85	53c3ac73-3354-4e75-9926-3a36ff1d94db	허남표	1	0	29	2024-11-02 10:35:00.979+00
86	53c3ac73-3354-4e75-9926-3a36ff1d94db	김노아	0	1	27	2024-11-02 10:35:00.979+00
87	027b57f6-a343-4f99-892e-70e132fa9cba	허남표	1	0	32	2024-11-02 10:35:09.364+00
88	027b57f6-a343-4f99-892e-70e132fa9cba	하종철	0	1	27	2024-11-02 10:35:09.364+00
89	2c8341e4-d24a-4485-89a5-5536b17b34d5	진현호	1	0	29	2024-11-02 10:36:40.073+00
90	2c8341e4-d24a-4485-89a5-5536b17b34d5	김노아	0	1	31	2024-11-02 10:36:40.073+00
91	ccc2c2c3-54ab-4d14-b751-711ed233ed10	게스트김민규	0	1	34	2024-11-02 10:37:19.309+00
92	ccc2c2c3-54ab-4d14-b751-711ed233ed10	신대현	1	0	36	2024-11-02 10:37:19.309+00
93	8cc79b09-17bf-473a-ab77-bd37e5de05a8	게스트김민규	0	1	34	2024-11-02 10:37:26.183+00
94	8cc79b09-17bf-473a-ab77-bd37e5de05a8	신대현	1	0	36	2024-11-02 10:37:26.183+00
95	158d6b22-cb33-4f2b-894b-a1af14d225b0	게스트김민규	0	1	35	2024-11-02 10:37:50.492+00
96	158d6b22-cb33-4f2b-894b-a1af14d225b0	정재영	1	0	36	2024-11-02 10:37:50.492+00
97	861a119c-f750-406d-9e66-36c14fadf4e3	진현호	1	0	34	2024-11-02 22:18:02.559+00
98	861a119c-f750-406d-9e66-36c14fadf4e3	신대현	0	1	31	2024-11-02 22:18:02.559+00
99	5c0f7816-f7f0-4879-a9db-e4bf444a6e5e	조예원	1	0	34	2024-11-02 22:18:13.303+00
100	5c0f7816-f7f0-4879-a9db-e4bf444a6e5e	신대현	0	1	30	2024-11-02 22:18:13.303+00
101	4c780937-c9c6-445a-b021-888458a854c4	게스트이종욱	0	1	30	2024-11-02 22:18:48.896+00
102	4c780937-c9c6-445a-b021-888458a854c4	조예원	1	0	37	2024-11-02 22:18:48.896+00
105	97863d0a-923f-4813-aa70-01b17a1de502	김순용	1	0	33	2024-11-02 22:25:59.038+00
106	97863d0a-923f-4813-aa70-01b17a1de502	김선재	0	1	25	2024-11-02 22:25:59.038+00
107	35c95dda-0337-4674-a454-23e6dad93452	진현호	0	1	27	2024-11-02 22:39:23.313+00
108	35c95dda-0337-4674-a454-23e6dad93452	허남표	1	0	31	2024-11-02 22:39:23.313+00
109	149f8de6-81ac-4c8c-bb55-f6dc470fbca1	최준용	1	0	25	2024-11-02 22:42:42.536+00
110	149f8de6-81ac-4c8c-bb55-f6dc470fbca1	김순용	0	1	26	2024-11-02 22:42:42.536+00
111	be57cf61-adec-4af8-9458-673c55484006	김두현	1	0	28	2024-11-02 22:45:53.005+00
112	be57cf61-adec-4af8-9458-673c55484006	홍의기	0	1	23	2024-11-02 22:45:53.005+00
113	56f61c88-bd32-4ed8-ac76-d7878669cf16	게스트이종욱	0	1	28	2024-11-02 22:46:03.724+00
114	56f61c88-bd32-4ed8-ac76-d7878669cf16	홍의기	1	0	37	2024-11-02 22:46:03.724+00
115	3d1172aa-b119-483a-ba8f-90b085380d0b	허남표	1	0	34	2024-11-02 23:06:03.422+00
116	3d1172aa-b119-483a-ba8f-90b085380d0b	신대현	0	1	27	2024-11-02 23:06:03.422+00
117	bcd60323-3998-4477-9592-cb1ee8c54efc	김두현	1	0	31	2024-11-02 23:11:20.096+00
118	bcd60323-3998-4477-9592-cb1ee8c54efc	진현호	0	1	23	2024-11-02 23:11:20.096+00
121	521c1428-0db0-46b3-b73c-5060029156a3	최준용	1	0	33	2024-11-02 23:11:30.083+00
122	521c1428-0db0-46b3-b73c-5060029156a3	김선재	0	1	26	2024-11-02 23:11:30.083+00
123	1e8f475b-0923-4030-9479-fbed9c764887	최준용	1	0	25	2024-11-02 23:45:40.078+00
124	1e8f475b-0923-4030-9479-fbed9c764887	김순용	0	1	26	2024-11-02 23:45:40.078+00
125	4e61d911-c234-4f5d-bc1d-cfeeabde0333	김선재	1	0	26	2024-11-02 23:46:20.65+00
126	4e61d911-c234-4f5d-bc1d-cfeeabde0333	최준용	0	1	33	2024-11-02 23:46:20.65+00
127	05846ccc-8fa6-4cc9-895e-0d886d2f73b9	조예원	1	0	31	2024-11-02 23:56:59.125+00
128	05846ccc-8fa6-4cc9-895e-0d886d2f73b9	진현호	0	1	30	2024-11-02 23:56:59.125+00
131	5c534ce3-f63a-41a6-b8ac-54f5a75d4ded	게스트이종욱	0	1	27	2024-11-03 00:00:12.8+00
132	5c534ce3-f63a-41a6-b8ac-54f5a75d4ded	허남표	1	0	37	2024-11-03 00:00:12.8+00
133	f12f5214-bd6a-458a-b62e-f12536a4dddf	게스트이종욱	0	1	31	2024-11-03 00:31:12.115+00
134	f12f5214-bd6a-458a-b62e-f12536a4dddf	진현호	1	0	37	2024-11-03 00:31:12.115+00
135	c8eb4d1a-67c9-492b-9eb9-252bd2bfb865	조예원	1	0	27	2024-11-03 00:43:03.012+00
136	c8eb4d1a-67c9-492b-9eb9-252bd2bfb865	허남표	0	1	30	2024-11-03 00:43:03.012+00
137	e55ccd96-4beb-4342-af73-f2dab3eaae42	홍의기	1	0	34	2024-11-03 00:43:36.406+00
138	e55ccd96-4beb-4342-af73-f2dab3eaae42	신대현	0	1	28	2024-11-03 00:43:36.406+00
139	5d3c9257-e1dd-496a-9255-23ccb5783ae8	게스트이종욱	0	1	34	2024-11-03 00:43:41.522+00
140	5d3c9257-e1dd-496a-9255-23ccb5783ae8	신대현	1	0	37	2024-11-03 00:43:41.522+00
141	88fa15e2-ec17-449c-b1b6-2cf5c486a012	조예원	1	0	28	2024-11-03 01:11:38.168+00
142	88fa15e2-ec17-449c-b1b6-2cf5c486a012	홍의기	0	1	30	2024-11-03 01:11:38.168+00
143	a7c669a8-786b-4c50-bb22-ef05004bcf4d	허남표	1	0	23	2024-11-03 01:11:44.507+00
144	a7c669a8-786b-4c50-bb22-ef05004bcf4d	김두현	0	1	27	2024-11-03 01:11:44.507+00
145	939fde3d-98ab-4f6b-b0ea-fadee63e22e3	김두현	1	0	37	2024-11-03 01:13:01.915+00
146	939fde3d-98ab-4f6b-b0ea-fadee63e22e3	게스트이종욱	0	1	23	2024-11-03 01:13:01.915+00
237	e1a05743-6cf0-4dc0-8b58-6e60fd4f62c4	신대현	1	0	25	2024-11-16 21:44:28.431+00
238	e1a05743-6cf0-4dc0-8b58-6e60fd4f62c4	김순용	0	1	34	2024-11-16 21:44:28.431+00
239	e8b30eac-76b2-4446-85ca-b5b8f06565b5	홍의기	1	0	27	2024-11-16 21:57:12.838+00
240	e8b30eac-76b2-4446-85ca-b5b8f06565b5	허남표	0	1	28	2024-11-16 21:57:12.838+00
241	e7d71e94-dd1d-4279-aab3-15f96ee32d3a	최준용	0	1	30	2024-11-16 21:57:35.957+00
242	e7d71e94-dd1d-4279-aab3-15f96ee32d3a	조예원	1	0	26	2024-11-16 21:57:35.957+00
243	b309cf65-58be-42a2-add4-68c5c0e2dae1	진현호	1	0	25	2024-11-16 22:26:34.151+00
244	b309cf65-58be-42a2-add4-68c5c0e2dae1	김순용	0	1	31	2024-11-16 22:26:34.151+00
245	afb5c1ac-db2e-4893-ad36-d8540e61dc92	진현호	1	0	34	2024-11-16 22:49:54.531+00
246	afb5c1ac-db2e-4893-ad36-d8540e61dc92	신대현	0	1	31	2024-11-16 22:49:54.531+00
247	ed1b0fb1-7da0-4856-ba18-801f6e81045b	진현호	1	0	34	2024-11-16 22:50:06.178+00
248	ed1b0fb1-7da0-4856-ba18-801f6e81045b	신대현	0	1	31	2024-11-16 22:50:06.178+00
257	572ac48f-7e20-46c0-b314-db032b496965	김노아	0	1	28	2024-11-16 23:00:37.344+00
258	572ac48f-7e20-46c0-b314-db032b496965	홍의기	1	0	29	2024-11-16 23:00:37.344+00
259	88ec6bb8-476d-4c16-b56d-093de11b1bdf	최준용	1	0	28	2024-11-16 23:00:44.111+00
260	88ec6bb8-476d-4c16-b56d-093de11b1bdf	홍의기	0	1	26	2024-11-16 23:00:44.111+00
261	9136d4b3-e9dd-4b40-a2ed-91f73a19a205	최준용	0	1	27	2024-11-16 23:11:55.495+00
262	9136d4b3-e9dd-4b40-a2ed-91f73a19a205	허남표	1	0	26	2024-11-16 23:11:55.495+00
263	c0ad459a-3405-4250-baca-e1820f91f531	최준용	1	0	31	2024-11-17 00:03:04.375+00
264	c0ad459a-3405-4250-baca-e1820f91f531	진현호	0	1	26	2024-11-17 00:03:04.375+00
265	d84ec8e8-dd90-43f1-86ee-165a2dc8dced	김두현	1	0	31	2024-11-17 00:03:10.302+00
266	d84ec8e8-dd90-43f1-86ee-165a2dc8dced	진현호	0	1	23	2024-11-17 00:03:10.302+00
267	915cca29-c2ee-4aea-ab00-988bbe4d9533	김노아	1	0	34	2024-11-17 00:05:47.497+00
268	915cca29-c2ee-4aea-ab00-988bbe4d9533	신대현	0	1	29	2024-11-17 00:05:47.497+00
269	c712d4bd-f326-40d5-9754-e3be78c18ac5	김노아	0	1	23	2024-11-17 00:22:43.389+00
270	c712d4bd-f326-40d5-9754-e3be78c18ac5	김두현	1	0	29	2024-11-17 00:22:43.389+00
271	f892d455-fb27-4165-9d6f-5afbe148ec54	김노아	0	1	23	2024-11-17 00:22:49.02+00
272	f892d455-fb27-4165-9d6f-5afbe148ec54	김두현	1	0	29	2024-11-17 00:22:49.02+00
273	0b4f35be-bedb-4c8b-8380-923ace4642ec	최준용	1	0	23	2024-11-17 00:22:54.878+00
274	0b4f35be-bedb-4c8b-8380-923ace4642ec	김두현	0	1	26	2024-11-17 00:22:54.878+00
275	5bcc23d1-19f3-4221-9332-6e203a7f74de	김노아	0	1	27	2024-11-17 00:24:16.623+00
276	5bcc23d1-19f3-4221-9332-6e203a7f74de	허남표	1	0	29	2024-11-17 00:24:16.623+00
277	8ba0de76-f1e6-490e-bcb8-ce336cd30d22	김두현	1	0	26	2024-11-17 00:38:43.748+00
278	8ba0de76-f1e6-490e-bcb8-ce336cd30d22	최준용	0	1	23	2024-11-17 00:38:43.748+00
279	3588e5ec-05c1-4e74-a03b-5820e1897b11	최준용	1	0	34	2024-11-17 01:07:34.268+00
280	3588e5ec-05c1-4e74-a03b-5820e1897b11	신대현	0	1	26	2024-11-17 01:07:34.268+00
281	8eda5949-ec1f-49a1-ba67-2acf81bc189e	김두현	1	0	34	2024-11-17 01:07:42.284+00
282	8eda5949-ec1f-49a1-ba67-2acf81bc189e	신대현	0	1	23	2024-11-17 01:07:42.284+00
283	6b768c82-93a9-49e7-9f39-7a7c075af823	김노아	0	1	28	2024-11-18 05:55:07.145+00
284	6b768c82-93a9-49e7-9f39-7a7c075af823	홍의기	1	0	29	2024-11-18 05:55:07.145+00
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."User" (id, name) FROM stdin;
23	김두현
25	김순용
26	최준용
27	허남표
28	홍의기
29	김노아
30	조예원
31	진현호
32	하종철
33	김선재
34	신대현
35	정재영
36	게스트김민규
37	게스트이종욱
\.


--
-- Name: Record_id_seq; Type: SEQUENCE SET; Schema: public; Owner: default
--

SELECT pg_catalog.setval('public."Record_id_seq"', 286, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: default
--

SELECT pg_catalog.setval('public."User_id_seq"', 71, true);


--
-- Name: Record Record_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Record"
    ADD CONSTRAINT "Record_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: Record Record_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Record"
    ADD CONSTRAINT "Record_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

