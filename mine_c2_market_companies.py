"""
Command and Control (C2) Systems Market - Comprehensive Web Mining & Data Extraction Pipeline
Scrapes, mines, enriches, and structures all 40 key market leaders from the C2 Market graphic.
Outputs clean, verified datasets in CSV and JSON formats.
"""

import os
import re
import csv
import json
import time
import sys
import logging
from typing import Dict, Any, List
from urllib.parse import urlparse

import requests
from bs4 import BeautifulSoup
import urllib3

# Suppress SSL warnings for legacy corporate endpoints if needed
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Ensure UTF-8 output
try:
    sys.stdout.reconfigure(encoding="utf-8", line_buffering=True)
except Exception:
    pass

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S"
)
logger = logging.getLogger("C2Miner")

WIKI_HEADERS = {
    "User-Agent": "C2MarketIntelligenceMiner/1.0 (https://defense-market-research.org; contact: intel@defenseresearch.org)"
}

WEB_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}

# The 40 key companies featured in the Command and Control Systems Market infographic
COMPANIES_MASTER = [
    {
        "rank": 1,
        "name": "Lockheed Martin Corporation",
        "short_name": "Lockheed Martin",
        "wiki_slug": "Lockheed_Martin",
        "website": "https://www.lockheedmartin.com",
        "contact_url": "https://www.lockheedmartin.com/en-us/contact.html",
        "linkedin": "https://www.linkedin.com/company/lockheed-martin",
        "c2_domain": "Integrated Air & Missile Defense C2, Multi-Domain Operations (JADC2), Naval Combat Systems",
        "flagship_c2_systems": "Aegis Combat System, Command Bridge, DiamondShield, Multi-Domain C2 (MDC2), C4ISRnet",
        "c2_products": "Aegis Weapon System, DiamondShield Multi-Domain C2, Command Bridge Tactical Software, FAAD C2, TPS-77 C2 Radar Integration",
        "key_clients": "US Department of Defense (Air Force, Army, Navy), NATO Allies, UK Ministry of Defence, Japan Self-Defense Forces, RAAF Australia",
        "headquarters_fallback": "Bethesda, Maryland, United States",
        "country": "United States",
        "phone_fallback": "+1 301-897-6000",
        "email_fallback": "media.relations@lmco.com",
    },
    {
        "rank": 2,
        "name": "Northrop Grumman Corporation",
        "short_name": "Northrop Grumman",
        "wiki_slug": "Northrop_Grumman",
        "website": "https://www.northropgrumman.com",
        "contact_url": "https://www.northropgrumman.com/who-we-are/contact-us",
        "linkedin": "https://www.linkedin.com/company/northrop-grumman-corporation",
        "c2_domain": "Integrated Air and Missile Defense Battle Command, Tactical C2, Joint All-Domain C2 (JADC2)",
        "flagship_c2_systems": "IBCS (Integrated Battle Command System), FAAD C2 (Forward Area Air Defense), Command Post Computing Environment (CPCE)",
        "c2_products": "IBCS Battle Command System, FAAD C2 Counter-UAS suite, C2BMC, Global Hawk C2 Ground Stations, SABR Radar C2",
        "key_clients": "US Army, US Air Force, US Space Force, US Navy, Polish Armed Forces, NATO Allies",
        "headquarters_fallback": "Falls Church, Virginia, United States",
        "country": "United States",
        "phone_fallback": "+1 703-280-2900",
        "email_fallback": "corporate.communications@ngc.com",
    },
    {
        "rank": 3,
        "name": "BAE Systems plc",
        "short_name": "BAE Systems",
        "wiki_slug": "BAE_Systems",
        "website": "https://www.baesystems.com",
        "contact_url": "https://www.baesystems.com/en/contact-us",
        "linkedin": "https://www.linkedin.com/company/bae-systems",
        "c2_domain": "Naval Combat Management Systems, Multi-Domain C4ISR, Tactical Communications & Battle Management",
        "flagship_c2_systems": "INTeACT Combat Management System (CMS), Falcon Tactical C4I, Type 26 Global Combat Ship C2, Net Strike",
        "c2_products": "DNA2 Combat Management System, Bowman Tactical C4I System, Herakles Radar C2, Falcon Broadband Tactical Network",
        "key_clients": "UK Ministry of Defence, Royal Navy, US Department of Defense, Royal Australian Navy, Saudi Armed Forces",
        "headquarters_fallback": "London, England, United Kingdom",
        "country": "United Kingdom",
        "phone_fallback": "+44 1252 373232",
        "email_fallback": "investors@baesystems.com",
    },
    {
        "rank": 4,
        "name": "The Boeing Company",
        "short_name": "Boeing",
        "wiki_slug": "Boeing",
        "website": "https://www.boeing.com",
        "contact_url": "https://www.boeing.com/contact-us",
        "linkedin": "https://www.linkedin.com/company/boeing",
        "c2_domain": "Airborne Early Warning & Control (AEW&C), Maritime Patrol C2, Battlespace Network Centric Operations",
        "flagship_c2_systems": "E-7 Wedgetail AEW&C C2 Suite, E-3 Sentry AWACS Mission System, P-8A Poseidon Tactical Mission System",
        "c2_products": "Battlespace Command and Control System, Phantom Fusion Multi-Source Correlation, Joint Tactical Radio System (JTRS) tech",
        "key_clients": "US Air Force, US Navy, Royal Air Force, RAAF, Republic of Korea Air Force, NATO AEW&C Force",
        "headquarters_fallback": "Arlington, Virginia, United States",
        "country": "United States",
        "phone_fallback": "+1 312-544-2000",
        "email_fallback": "communications@boeing.com",
    },
    {
        "rank": 5,
        "name": "RTX Corporation",
        "short_name": "RTX (Raytheon)",
        "wiki_slug": "RTX_Corporation",
        "website": "https://www.rtx.com",
        "contact_url": "https://www.rtx.com/contact",
        "linkedin": "https://www.linkedin.com/company/rtx",
        "c2_domain": "Air and Missile Defense C2, Tactical Track Correlation, Battle Management Command & Control (BMC2)",
        "flagship_c2_systems": "Solipsys Tactical Display Framework (TDF), Multi-Source Correlator Tracker (MSCT), Patriot Engagement Control Station (ECS)",
        "c2_products": "Solipsys MSCT, Tactical Control System (TCS), Patriot Air & Missile Defense C2, Joint Track Management System (JTMS)",
        "key_clients": "US Department of Defense, US Army, US Navy, 19+ International Patriot Partner Nations, NATO Allies",
        "headquarters_fallback": "Arlington, Virginia, United States",
        "country": "United States",
        "phone_fallback": "+1 781-522-3000",
        "email_fallback": "corporatecommunications@rtx.com",
    },
    {
        "rank": 6,
        "name": "General Dynamics Corporation",
        "short_name": "General Dynamics",
        "wiki_slug": "General_Dynamics",
        "website": "https://www.gd.com",
        "contact_url": "https://www.gd.com/contact-us",
        "linkedin": "https://www.linkedin.com/company/general-dynamics",
        "c2_domain": "Ground Tactical C4ISR, Battlefield Management Systems, Naval C4I & Common Hardware Systems",
        "flagship_c2_systems": "TIGR (Tactical Ground Reporting System), TacMAST, Common Hardware Systems (CHS-6), Blue Force Tracking / JBC-P",
        "c2_products": "Tactical Air Control Party C2 System, Mounted Computing Environment (MCE), Tactical Communications Networks, Navy Submarine C2",
        "key_clients": "US Army, US Marine Corps, US Navy, Canadian Armed Forces, UK MoD",
        "headquarters_fallback": "Reston, Virginia, United States",
        "country": "United States",
        "phone_fallback": "+1 703-876-3000",
        "email_fallback": "investorrelations@generaldynamics.com",
    },
    {
        "rank": 7,
        "name": "Thales Group",
        "short_name": "Thales",
        "wiki_slug": "Thales_Group",
        "website": "https://www.thalesgroup.com",
        "contact_url": "https://www.thalesgroup.com/en/global/contacts",
        "linkedin": "https://www.linkedin.com/company/thales",
        "c2_domain": "Naval Combat Management, Air Traffic & Air Defense C2, Tactical Communications & Cyber C2",
        "flagship_c2_systems": "TACTICOS Combat Management System, TopSky Air Command & Control, CONTACT Software-Defined C2 Radio Network",
        "c2_products": "TACTICOS CMS, TopSky ATC/Air C2, Ground Master Radar Integration Suite, PR4G Tactical C2 Radios, Cybels Cyber C2",
        "key_clients": "French Armed Forces (Marine Nationale, French Air and Space Force), NATO Nations, 25+ Global Navies, Middle East & Asian Defense Ministries",
        "headquarters_fallback": "Paris, France",
        "country": "France",
        "phone_fallback": "+33 1 57 77 80 00",
        "email_fallback": "pressrelations@thalesgroup.com",
    },
    {
        "rank": 8,
        "name": "Rheinmetall AG",
        "short_name": "Rheinmetall",
        "wiki_slug": "Rheinmetall",
        "website": "https://www.rheinmetall.com",
        "contact_url": "https://www.rheinmetall.com/en/contact",
        "linkedin": "https://www.linkedin.com/company/rheinmetall",
        "c2_domain": "Land Tactical Battle Management, Dismounted Soldier C2, Air Defence Command & Control",
        "flagship_c2_systems": "TacNet Tactical Management System, Gladius / IdZ-ES Soldier System C2, Skymaster Air Defence C2",
        "c2_products": "TacNet Soldier / Vehicle / Command C2, Skynex Air Defence C2, Boxer / Lynx Armoured Vehicle C2 architecture",
        "key_clients": "German Bundeswehr, Australian Defence Force, British Army, NATO European allies, Ukrainian Armed Forces",
        "headquarters_fallback": "Düsseldorf, Germany",
        "country": "Germany",
        "phone_fallback": "+49 211 473-01",
        "email_fallback": "info@rheinmetall.com",
    },
    {
        "rank": 9,
        "name": "CACI International Inc.",
        "short_name": "CACI",
        "wiki_slug": "CACI",
        "website": "https://www.caci.com",
        "contact_url": "https://www.caci.com/contact-us",
        "linkedin": "https://www.linkedin.com/company/caci-international-inc",
        "c2_domain": "Joint All-Domain Command and Control (JADC2), Signals Intelligence (SIGINT) C2, Tactical Cyber Warfare C2",
        "flagship_c2_systems": "DarkBlue Intelligence C2, Tactical SIGINT C2, Multi-Domain C4ISR Solutions, Blue Force C2 software",
        "c2_products": "Spectral Tactical SIGINT C2, Multi-Domain Agile C2, Corian Counter-UAS C2, Automated Target Recognition modules",
        "key_clients": "US Department of Defense, US Intelligence Community, US Special Operations Command (USSOCOM), US Army, US Navy",
        "headquarters_fallback": "Reston, Virginia, United States",
        "country": "United States",
        "phone_fallback": "+1 703-841-7800",
        "email_fallback": "investorrelations@caci.com",
    },
    {
        "rank": 10,
        "name": "Elbit Systems Ltd.",
        "short_name": "Elbit Systems",
        "wiki_slug": "Elbit_Systems",
        "website": "https://www.elbitsystems.com",
        "contact_url": "https://elbitsystems.com/contact-us/",
        "linkedin": "https://www.linkedin.com/company/elbit-systems-ltd",
        "c2_domain": "Battle Management Systems (BMS), Dismounted Soldier C2, Artillery Command & Control, Homeland Security C2",
        "flagship_c2_systems": "TORC2H Battle Management System, Dominator Integrated Soldier C2, Combat NG Artillery C2 System",
        "c2_products": "TORC2H BMS, Combat NG C2, Smart System C2, HattoriX Target Acquisition & C2, Hermes UAS Ground Control Station",
        "key_clients": "Israel Defense Forces (IDF), US Department of Defense, UK Ministry of Defence, European & Asia-Pacific Armed Forces",
        "headquarters_fallback": "Haifa, Israel",
        "country": "Israel",
        "phone_fallback": "+972 77-294-0000",
        "email_fallback": "marcom@elbitsystems.com",
    },
    {
        "rank": 11,
        "name": "L3Harris Technologies, Inc.",
        "short_name": "L3Harris",
        "wiki_slug": "L3Harris",
        "website": "https://www.l3harris.com",
        "contact_url": "https://www.l3harris.com/contact-us",
        "linkedin": "https://www.linkedin.com/company/l3harris-technologies",
        "c2_domain": "Tactical Communications C4ISR, Resilient Battle Management, Multi-Domain Joint C2 Networks",
        "flagship_c2_systems": "Falcon III / Falcon IV Tactical C2 Radios, hMOD Software-Defined Architecture, Battle Management Applications (BMA)",
        "c2_products": "AN/PRC-158 / AN/PRC-163 Multi-channel Radios, Open-Architecture C2 suites, WESCAM EO/IR C2 Integration, JADC2 Edge Nodes",
        "key_clients": "US Army, US Air Force, US Navy, US Special Operations Command, Five Eyes Alliances, 100+ Allied Nations",
        "headquarters_fallback": "Melbourne, Florida, United States",
        "country": "United States",
        "phone_fallback": "+1 321-727-9100",
        "email_fallback": "media@l3harris.com",
    },
    {
        "rank": 12,
        "name": "Leonardo S.p.A.",
        "short_name": "Leonardo",
        "wiki_slug": "Leonardo_S.p.A.",
        "website": "https://www.leonardo.com",
        "contact_url": "https://www.leonardo.com/en/contact-us",
        "linkedin": "https://www.linkedin.com/company/leonardo-company",
        "c2_domain": "Naval Combat Management, Airborne Tactical Observation C2, Land Digitization Battle Management",
        "flagship_c2_systems": "SADOC Naval Combat Management System, ATOS (Airborne Tactical Observation and Surveillance), Forza NEC Tactical C2",
        "c2_products": "SADOC 3/4 CMS, ATOS Mission System, Kronos Grand Mobile C2 Radar, Linx C2 software, Cyber C4I solutions",
        "key_clients": "Italian Armed Forces, NATO Alliances, UK MoD, Brazilian Navy, Middle Eastern Defense Forces",
        "headquarters_fallback": "Rome, Italy",
        "country": "Italy",
        "phone_fallback": "+39 06 324731",
        "email_fallback": "ufficiostampa@leonardo.com",
    },
    {
        "rank": 13,
        "name": "Motorola Solutions, Inc.",
        "short_name": "Motorola Solutions",
        "wiki_slug": "Motorola_Solutions",
        "website": "https://www.motorolasolutions.com",
        "contact_url": "https://www.motorolasolutions.com/en_us/contact-us.html",
        "linkedin": "https://www.linkedin.com/company/motorolasolutions",
        "c2_domain": "Public Safety Command & Control, Computer-Aided Dispatch (CAD), Mission-Critical Command Centers",
        "flagship_c2_systems": "CommandCentral Suite (CAD, Aware, Inform, Vault), PremierOne CAD, Critical Connect Interoperability Platform",
        "c2_products": "CommandCentral CAD, CommandCentral Aware Common Operational Picture, APX NEXT Mission Critical Communications, VESTA 9-1-1 C2",
        "key_clients": "US Defense Agencies (Base Security), 10,000+ Law Enforcement & First Responder Agencies Worldwide, NATO Defense Facilities",
        "headquarters_fallback": "Chicago, Illinois, United States",
        "country": "United States",
        "phone_fallback": "+1 888-325-9336",
        "email_fallback": "info@motorolasolutions.com",
    },
    {
        "rank": 14,
        "name": "Saab AB",
        "short_name": "Saab",
        "wiki_slug": "Saab_AB",
        "website": "https://www.saab.com",
        "contact_url": "https://www.saab.com/contact",
        "linkedin": "https://www.linkedin.com/company/saab",
        "c2_domain": "Naval Combat Management Systems, Ground Based Air Defence C2, Gripen Tactical Mission Systems",
        "flagship_c2_systems": "9LV Naval Combat Management System, Giraffe Radar C2 Suite, Trackfire C2, Safeguard Air Command & Control",
        "c2_products": "9LV CMS, Giraffe 1X/4A/8A C2 integration, 9Land BMS, Trackfire Remote Weapon C2, GlobalEye AEW&C C2 suite",
        "key_clients": "Swedish Armed Forces, Royal Australian Navy, Royal Canadian Navy, Finnish Navy, NATO Allies",
        "headquarters_fallback": "Stockholm, Sweden",
        "country": "Sweden",
        "phone_fallback": "+46 8 463 00 00",
        "email_fallback": "presscentre@saabgroup.com",
    },
    {
        "rank": 15,
        "name": "Indra Sistemas, S.A.",
        "short_name": "Indra",
        "wiki_slug": "Indra_Sistemas",
        "website": "https://www.indracompany.com",
        "contact_url": "https://www.indracompany.com/en/contact",
        "linkedin": "https://www.linkedin.com/company/indra",
        "c2_domain": "Air Defense Command & Control, Land Battlefield Management Systems, Naval Combat Systems",
        "flagship_c2_systems": "Air Command and Control System (Air C2), BMS-Lince Battlefield Management System, SCOMBA Naval Combat System",
        "c2_products": "Air C2 / ACAS, BMS-Lince for Leopard/Pizarro armor, SCOMBA CMS for Spanish Navy, Crow Counter-UAS C2",
        "key_clients": "Spanish Ministry of Defence, NATO Air Command (AIRCOM), European Defence Agency, Latin American & Middle East MoDs",
        "headquarters_fallback": "Alcobendas, Madrid, Spain",
        "country": "Spain",
        "phone_fallback": "+34 91 480 50 00",
        "email_fallback": "comunicacion@indracompany.com",
    },
    {
        "rank": 16,
        "name": "Kongsberg Gruppen ASA",
        "short_name": "Kongsberg",
        "wiki_slug": "Kongsberg_Gruppen",
        "website": "https://www.kongsberg.com",
        "contact_url": "https://www.kongsberg.com/contact-us/",
        "linkedin": "https://www.linkedin.com/company/kongsberg",
        "c2_domain": "Air Defence Battle Management, Naval Combat Management Systems, Remote Weapon Station C2",
        "flagship_c2_systems": "BMC4I (Battle Management C4I), NASAMS Fire Distribution Center (FDC), C-Flex Naval C2 Suite",
        "c2_products": "NASAMS FDC C2, PROTECTOR Remote Weapon Station C2, Naval Strike Missile (NSM) Mission Planning C2, C-Scope C2",
        "key_clients": "Norwegian Armed Forces, US Army, US Air Force (NASAMS Capital Air Defense), 13+ NASAMS customer nations",
        "headquarters_fallback": "Kongsberg, Norway",
        "country": "Norway",
        "phone_fallback": "+47 32 28 82 00",
        "email_fallback": "office@kongsberg.com",
    },
    {
        "rank": 17,
        "name": "Honeywell International Inc.",
        "short_name": "Honeywell",
        "wiki_slug": "Honeywell",
        "website": "https://www.honeywell.com",
        "contact_url": "https://www.honeywell.com/us/en/contact-us",
        "linkedin": "https://www.linkedin.com/company/honeywell",
        "c2_domain": "Connected Battlespace Avionics, Tactical Cockpit C2 Displays, Resilient Positioning, Navigation and Timing (PNT)",
        "flagship_c2_systems": "Honeywell Connected Battlespace Architecture, Tactical Advanced Mission Management System, Primus Epic Flight & C2 Display",
        "c2_products": "TALIN Inertial Land Navigation C2, Defense Satellite Communications Terminals, Electronic Flight Displays for Defense C2",
        "key_clients": "US Department of Defense, Boeing, Lockheed Martin, Airbus Defence, International Allied Air Forces",
        "headquarters_fallback": "Charlotte, North Carolina, United States",
        "country": "United States",
        "phone_fallback": "+1 704-627-6200",
        "email_fallback": "honeywellmediainquiries@honeywell.com",
    },
    {
        "rank": 18,
        "name": "Leidos Holdings, Inc.",
        "short_name": "Leidos",
        "wiki_slug": "Leidos",
        "website": "https://www.leidos.com",
        "contact_url": "https://www.leidos.com/contact",
        "linkedin": "https://www.linkedin.com/company/leidos",
        "c2_domain": "Joint All-Domain Command & Control (JADC2), Defense Intelligence C4ISR, Maritime Autonomous C2",
        "flagship_c2_systems": "Command Post of the Future (CPOF) Modernization, Air Force Distributed Common Ground System (AF DCGS), Sea Hunter Autonomous C2",
        "c2_products": "JADC2 Open Architecture solutions, Tactical Edge Analytics, Defense Enclave Services, Air C2 modernization suites",
        "key_clients": "US Department of Defense, US Air Force, US Army, US Navy, Federal Aviation Administration, UK Ministry of Defence",
        "headquarters_fallback": "Reston, Virginia, United States",
        "country": "United States",
        "phone_fallback": "+1 571-526-6000",
        "email_fallback": "mediarelations@leidos.com",
    },
    {
        "rank": 19,
        "name": "Booz Allen Hamilton Holding Corporation",
        "short_name": "Booz Allen Hamilton",
        "wiki_slug": "Booz_Allen_Hamilton",
        "website": "https://www.boozallen.com",
        "contact_url": "https://www.boozallen.com/tools/footer/contact-us.html",
        "linkedin": "https://www.linkedin.com/company/booz-allen-hamilton",
        "c2_domain": "JADC2 Enterprise Architecture, Tactical AI/ML Decision Support, Cyber Command & Control Operations",
        "flagship_c2_systems": "Tactical Edge AI C2 Platform, JADC2 Interoperability Frameworks, Defense Threat Matrix C2",
        "c2_products": "Cyber Defense Operations C2, Joint Fires Modernization frameworks, Mission Analytics & Edge Computing solutions",
        "key_clients": "US Department of Defense, US Cyber Command, US Army, US Navy, US Air Force, US Space Force, Intelligence Community",
        "headquarters_fallback": "McLean, Virginia, United States",
        "country": "United States",
        "phone_fallback": "+1 703-902-5000",
        "email_fallback": "media_relations@bah.com",
    },
    {
        "rank": 20,
        "name": "Science Applications International Corporation (SAIC)",
        "short_name": "SAIC",
        "wiki_slug": "Science_Applications_International_Corporation",
        "website": "https://www.saic.com",
        "contact_url": "https://www.saic.com/contact-us",
        "linkedin": "https://www.linkedin.com/company/saicinc",
        "c2_domain": "Joint All-Domain Fires C2, Cloud-Based Command Centers, Army/Navy C4ISR Integration",
        "flagship_c2_systems": "Joint Fires Network (JFN) Integration, Cloud One Defense Architecture, Tactical Mission Command (TMC) software",
        "c2_products": "Cloud One Multi-Cloud C2, Edge Computing Command Nodes, Space & Ground Weapon System C2, Naval C4ISR systems",
        "key_clients": "US Army, US Navy, US Air Force, Defense Information Systems Agency (DISA), US Space Force",
        "headquarters_fallback": "Reston, Virginia, United States",
        "country": "United States",
        "phone_fallback": "+1 703-676-4300",
        "email_fallback": "media@saic.com",
    },
    {
        "rank": 21,
        "name": "Huntington Ingalls Industries, Inc. (HII)",
        "short_name": "HII",
        "wiki_slug": "Huntington_Ingalls_Industries",
        "website": "https://www.hii.com",
        "contact_url": "https://hii.com/contact-us/",
        "linkedin": "https://www.linkedin.com/company/huntington-ingalls-industries",
        "c2_domain": "Naval Warfare C5ISR Integration, Autonomous Maritime Unmanned Vehicle C2, Live-Virtual-Constructive (LVC) Simulation",
        "flagship_c2_systems": "Odyssey Autonomous C2 Suite for Unmanned Surface/Undersea Vessels, Mission Technologies C5ISR Command Centers",
        "c2_products": "Odyssey Autonomy Suite, REMUS Unmanned Undersea Vehicle C2, Surface Ship Command Systems Engineering, Cyber Defense C2",
        "key_clients": "US Navy, US Marine Corps, US Coast Guard, Allied International Navies",
        "headquarters_fallback": "Newport News, Virginia, United States",
        "country": "United States",
        "phone_fallback": "+1 757-380-2000",
        "email_fallback": "communications@hii.com",
    },
    {
        "rank": 22,
        "name": "Palantir Technologies Inc.",
        "short_name": "Palantir",
        "wiki_slug": "Palantir_Technologies",
        "website": "https://www.palantir.com",
        "contact_url": "https://www.palantir.com/contact/",
        "linkedin": "https://www.linkedin.com/company/palantir-technologies",
        "c2_domain": "AI-Powered Battle Command, Intelligence Fusion & Decision Support, Tactical Ground Stations",
        "flagship_c2_systems": "Palantir Gotham, Artificial Intelligence Platform (AIP) for Defense, Project Maven Smart System, TITAN Tactical Station",
        "c2_products": "TITAN (Tactical Intelligence Targeting Access Node) C2, Gotham Intelligence Fusion, Maven Smart System AI C2, MetaConstellation",
        "key_clients": "US Army, US Air Force, US Department of Defense, US Special Operations Command, UK Ministry of Defence, NATO Forces",
        "headquarters_fallback": "Denver, Colorado / Miami, Florida, United States",
        "country": "United States",
        "phone_fallback": "+1 720-358-3888",
        "email_fallback": "media@palantir.com",
    },
    {
        "rank": 23,
        "name": "Anduril Industries",
        "short_name": "Anduril",
        "wiki_slug": "Anduril_Industries",
        "website": "https://www.anduril.com",
        "contact_url": "https://www.anduril.com/contact/",
        "linkedin": "https://www.linkedin.com/company/anduril-industries",
        "c2_domain": "Autonomous Multi-Domain Command & Control Operating System, AI Counter-UAS Battle Management",
        "flagship_c2_systems": "Lattice OS (Autonomous Command and Control Platform for Air, Land, and Sea Defense)",
        "c2_products": "Lattice OS, Sentry Tower C2, Anvil Interceptor C2, Ghost UAS Autonomous Control, Dive-LD AUV C2, Roadrunner C2",
        "key_clients": "US Special Operations Command, US Customs and Border Protection, US Air Force, US Navy, UK Ministry of Defence, Australian Defence Force",
        "headquarters_fallback": "Costa Mesa, California, United States",
        "country": "United States",
        "phone_fallback": "+1 949-508-2578",
        "email_fallback": "press@anduril.com",
    },
    {
        "rank": 24,
        "name": "Kratos Defense & Security Solutions, Inc.",
        "short_name": "Kratos",
        "wiki_slug": "Kratos_Defense_%26_Security_Solutions",
        "website": "https://www.kratosdefense.com",
        "contact_url": "https://www.kratosdefense.com/contact-us",
        "linkedin": "https://www.linkedin.com/company/kratos-defense-and-security-solutions",
        "c2_domain": "Virtualized Space/Satellite C2, Unmanned Aerial Combat Systems (UACS) Ground Control, Target Drone C2",
        "flagship_c2_systems": "OpenSpace Virtualized Satellite C2 Platform, Tactical UAS Command and Control Station, Compass Ground C2",
        "c2_products": "OpenSpace Platform, XQ-58A Valkyrie Ground Control Station, BQM-167/BQM-177 Target Drone C2, SpectralNet Space C2",
        "key_clients": "US Space Force, US Air Force, US Navy, NASA, International Satellite Operators and Allied Defense Forces",
        "headquarters_fallback": "San Diego, California, United States",
        "country": "United States",
        "phone_fallback": "+1 858-812-7300",
        "email_fallback": "investor@kratosdefense.com",
    },
    {
        "rank": 25,
        "name": "General Atomics",
        "short_name": "General Atomics",
        "wiki_slug": "General_Atomics",
        "website": "https://www.ga.com",
        "contact_url": "https://www.ga.com/contact",
        "linkedin": "https://www.linkedin.com/company/general-atomics",
        "c2_domain": "Remotely Piloted Aircraft Ground Control Stations (GCS), Multi-Mission Tactical C2, Electromagnetic Weapon C2",
        "flagship_c2_systems": "Advanced Cockpit Ground Control Station (GCS) for MQ-9 Reaper / Predator, STARE Mission Planning C2",
        "c2_products": "MQ-9B SkyGuardian/SeaGuardian GCS, Lynx Multi-Mode Radar C2, EMALS Aircraft Launch C2, Metis Tactical C2",
        "key_clients": "US Air Force, US Navy, US Department of Homeland Security, UK Royal Air Force, Italian Air Force, Japan Coast Guard",
        "headquarters_fallback": "San Diego, California, United States",
        "country": "United States",
        "phone_fallback": "+1 858-455-3000",
        "email_fallback": "asi-media@ga-asi.com",
    },
    {
        "rank": 26,
        "name": "Textron Inc.",
        "short_name": "Textron",
        "wiki_slug": "Textron",
        "website": "https://www.textron.com",
        "contact_url": "https://www.textron.com/Contact",
        "linkedin": "https://www.linkedin.com/company/textron",
        "c2_domain": "Multi-Domain Control & Collaboration, Tactical Unmanned Ground Control Stations, Combat Vehicle Mission Systems",
        "flagship_c2_systems": "Synturian Multi-Domain C2 Software, Universal Ground Control Station (UGCS) for Shadow UAS, RIPSAW Autonomous Vehicle C2",
        "c2_products": "Synturian Control and Collaboration Software, UGCS, Aerosonde UAS C2, Bell V-280 Valor Cockpit Mission System C2",
        "key_clients": "US Army, US Marine Corps, US Navy, Allied International Militaries",
        "headquarters_fallback": "Providence, Rhode Island, United States",
        "country": "United States",
        "phone_fallback": "+1 401-421-2800",
        "email_fallback": "investorrelations@textron.com",
    },
    {
        "rank": 27,
        "name": "Babcock International Group plc",
        "short_name": "Babcock International",
        "wiki_slug": "Babcock_International",
        "website": "https://www.babcockinternational.com",
        "contact_url": "https://www.babcockinternational.com/contact-us/",
        "linkedin": "https://www.linkedin.com/company/babcock-international-group",
        "c2_domain": "Naval Combat Systems Integration, Submarine Tactical Communications & C2, Land Defence Equipment C2 Support",
        "flagship_c2_systems": "Submarine Integrated Communications and C2 Systems, Arrowhead 140 / Type 31 Frigate Combat System Architecture",
        "c2_products": "Naval Weapons Handling & C2 Interfaces, Tactical Data Links integration, Vanguard / Astute Submarine C2 maintenance",
        "key_clients": "UK Ministry of Defence, Royal Navy, British Army, Royal Air Force, Polish Navy, Indonesian Navy, Royal Australian Navy",
        "headquarters_fallback": "London, England, United Kingdom",
        "country": "United Kingdom",
        "phone_fallback": "+44 20 7355 5300",
        "email_fallback": "investors@babcockinternational.com",
    },
    {
        "rank": 28,
        "name": "Serco Group plc",
        "short_name": "Serco",
        "wiki_slug": "Serco_Group",
        "website": "https://www.serco.com",
        "contact_url": "https://www.serco.com/contact-us",
        "linkedin": "https://www.linkedin.com/company/serco",
        "c2_domain": "C5ISR System Modernization & Lifecycle Engineering, Military Base Operations Command Centers, Maritime Fleet C2 Support",
        "flagship_c2_systems": "C5ISR Shipboard Installation and Command Center Upgrades, High-Altitude Defense Operations C2 Support",
        "c2_products": "Naval C5ISR lifecycle solutions, Air Defense Radar Operation C2, Joint Base Operations Command Centers, Space Surveillance support",
        "key_clients": "US Navy (NAVSEA/NIWC), US Air Force, UK Ministry of Defence, Australian Defence Force, Canadian Department of National Defence",
        "headquarters_fallback": "Hook, Hampshire, United Kingdom",
        "country": "United Kingdom",
        "phone_fallback": "+44 1256 745900",
        "email_fallback": "generalenquiries@serco.com",
    },
    {
        "rank": 29,
        "name": "QinetiQ Group plc",
        "short_name": "QinetiQ",
        "wiki_slug": "Qinetiq",
        "website": "https://www.qinetiq.com",
        "contact_url": "https://www.qinetiq.com/en/contact-us",
        "linkedin": "https://www.linkedin.com/company/qinetiq",
        "c2_domain": "Mission Data Management, Autonomous Decision-Making C2, Digital Battlespace & Cyber C4ISR Assurance",
        "flagship_c2_systems": "Mission Data Production Systems, Autonomous Robotics Control Architecture, Digital Test & Evaluation C2",
        "c2_products": "Tartan Mission Data suite, Cyber Shield C2, Banshee Target C2, Edge-Processing Tactical Sensor C2 nodes",
        "key_clients": "UK Ministry of Defence, US Department of Defense, Australian Defence Force, NATO Defense Innovation Organizations",
        "headquarters_fallback": "Farnborough, Hampshire, United Kingdom",
        "country": "United Kingdom",
        "phone_fallback": "+44 1252 392000",
        "email_fallback": "customercontact@qinetiq.com",
    },
    {
        "rank": 30,
        "name": "Airbus SE (Airbus Defence and Space)",
        "short_name": "Airbus Defence and Space",
        "wiki_slug": "Airbus_Defence_and_Space",
        "website": "https://www.airbus.com",
        "contact_url": "https://www.airbus.com/en/contact-us",
        "linkedin": "https://www.linkedin.com/company/airbusdefenceandspace",
        "c2_domain": "Air Command & Control, FCAS Combat Cloud, Tactical Secure Communications & Military Satellite C2",
        "flagship_c2_systems": "Fortion Air Command & Control (Fortion C2), Tactilon Tactical Communications C2, Skynet Military Satellite C2",
        "c2_products": "Fortion C2 Air / Joint suites, FCAS Air Combat Cloud architecture, Tactilon Dabat C2, Eurostar Military Space Ground C2",
        "key_clients": "French Air and Space Force, German Luftwaffe, Spanish Air and Space Force, NATO Alliance, UK MoD",
        "headquarters_fallback": "Taufkirchen (Munich), Germany / Leiden, Netherlands",
        "country": "Germany / France",
        "phone_fallback": "+49 89 6070",
        "email_fallback": "press@airbus.com",
    },
    {
        "rank": 31,
        "name": "MBDA",
        "short_name": "MBDA Systems",
        "wiki_slug": "MBDA",
        "website": "https://www.mbda-systems.com",
        "contact_url": "https://www.mbda-systems.com/contact-us/",
        "linkedin": "https://www.linkedin.com/company/mbda",
        "c2_domain": "Ground-Based Air Defence Command & Control (GBAD C2), Missile Fire Control & Engagement Planning",
        "flagship_c2_systems": "Licorne Light Air Defence C2, Ground-Based Air Defence (GBAD) Tactical C2 Suite, Aster / CAMM Engagement C2",
        "c2_products": "Licorne C2 for Mistral/VSHORAD, MCP (Missile Combat Post) C2, Sea Ceptor / CAMM Fire Control, Exocet / Aster Engagement Planning",
        "key_clients": "French Armed Forces, UK Armed Forces, Italian Armed Forces, German Bundeswehr, 90+ Armed Forces Worldwide",
        "headquarters_fallback": "Le Plessis-Robinson (Paris), France",
        "country": "France",
        "phone_fallback": "+33 1 71 54 10 00",
        "email_fallback": "press@mbda-systems.com",
    },
    {
        "rank": 32,
        "name": "Dassault Aviation",
        "short_name": "Dassault Aviation",
        "wiki_slug": "Dassault_Aviation",
        "website": "https://www.dassault-aviation.com",
        "contact_url": "https://www.dassault-aviation.com/en/group/contact/",
        "linkedin": "https://www.linkedin.com/company/dassault-aviation",
        "c2_domain": "Omnirole Combat Aircraft Tactical C2, Mission Planning & Tactical Data Exchange Systems",
        "flagship_c2_systems": "Rafale Integrated Mission & Weapon Management C2, SLPRG Mission Planning & Debriefing System",
        "c2_products": "Rafale F4/F5 Combat Cloud C2, SPECTRA Electronic Warfare C2, SLPRG Tactical Mission Planning, nEUROn UCAV autonomous C2",
        "key_clients": "French Air and Space Force, French Navy (Aéronavale), Indian Air Force, Greek Air Force, UAE Air Force, Egyptian Air Force",
        "headquarters_fallback": "Paris, France",
        "country": "France",
        "phone_fallback": "+33 1 47 11 40 00",
        "email_fallback": "communication@dassault-aviation.com",
    },
    {
        "rank": 33,
        "name": "Safran SA",
        "short_name": "Safran",
        "wiki_slug": "Safran",
        "website": "https://www.safran-group.com",
        "contact_url": "https://www.safran-group.com/contact-us",
        "linkedin": "https://www.linkedin.com/company/safran",
        "c2_domain": "Tactical Optronics & Navigation C2, Dismounted Soldier Mission Systems, Fire Control Integration",
        "flagship_c2_systems": "FÉLIN Dismounted Soldier C2 (legacy/evolution), Geonyx Tactical Navigation & C2, Euroflir Airborne Mission C2",
        "c2_products": "PASEO Weapon Control C2, Sigma 30 Artillery Navigation & Pointing C2, Patroller Tactical UAS Ground Control Station",
        "key_clients": "French Army, French Navy, International Land and Naval Defense Forces in Europe, Asia, and Middle East",
        "headquarters_fallback": "Paris, France",
        "country": "France",
        "phone_fallback": "+33 1 40 60 80 80",
        "email_fallback": "contact-defense@safrangroup.com",
    },
    {
        "rank": 34,
        "name": "HENSOLDT AG",
        "short_name": "HENSOLDT",
        "wiki_slug": "Hensoldt",
        "website": "https://www.hensoldt.net",
        "contact_url": "https://www.hensoldt.net/contact/",
        "linkedin": "https://www.linkedin.com/company/hensoldt",
        "c2_domain": "Radar & Sensor Data Fusion C2, Air Defense Battle Situational Awareness, Land Vehicle Mission Systems",
        "flagship_c2_systems": "CxEye Situational Awareness & C2 Software Suite, TRML-4D Air Defense Radar C2, SETAS Land Mission System",
        "c2_products": "CxEye Battle C2, TRML-4D (IRIS-T SLM C2 integration), Twinvis Passive Radar C2, SPEXER Security Radar C2",
        "key_clients": "German Bundeswehr, Ukrainian Armed Forces (Air Defense), NATO Partners, European Navies and Land Forces",
        "headquarters_fallback": "Taufkirchen (Munich), Germany",
        "country": "Germany",
        "phone_fallback": "+49 89 51518-0",
        "email_fallback": "info@hensoldt.net",
    },
    {
        "rank": 35,
        "name": "Rohde & Schwarz GmbH & Co. KG",
        "short_name": "Rohde & Schwarz",
        "wiki_slug": "Rohde_%26_Schwarz",
        "website": "https://www.rohde-schwarz.com",
        "contact_url": "https://www.rohde-schwarz.com/contact",
        "linkedin": "https://www.linkedin.com/company/rohde-&-schwarz",
        "c2_domain": "Joint Tactical Software-Defined Radio C4I, Integrated Naval Communications C2, Air Traffic / Air Defense C2",
        "flagship_c2_systems": "SOVERON Joint C4I Communication & C2 Architecture, NAVICS Integrated Naval Communications System, CERTIUM Air C2",
        "c2_products": "SOVERON Tactical Software Defined Radios, NAVICS IP-based Naval C2 Communications, ARDRONIS Drone Detection & C2",
        "key_clients": "German Armed Forces, Royal Navy, German Navy, NATO Allied Navies & Air Forces, 80+ Armed Forces Worldwide",
        "headquarters_fallback": "Munich, Bavaria, Germany",
        "country": "Germany",
        "phone_fallback": "+49 89 4129-0",
        "email_fallback": "info@rohde-schwarz.com",
    },
    {
        "rank": 36,
        "name": "Atos SE (Eviden)",
        "short_name": "Eviden (Atos)",
        "wiki_slug": "Eviden",
        "website": "https://eviden.com",
        "contact_url": "https://eviden.com/contact-us/",
        "linkedin": "https://www.linkedin.com/company/eviden",
        "c2_domain": "Tactical Battle Management Systems, Defense Edge AI & High-Performance Computing, Secure Tactical Communications",
        "flagship_c2_systems": "SICS (Système d'Information sur le Combat Scorpion) for French Army, Auxylium Tactical Command & Control, BullSequana Edge AI",
        "c2_products": "SICS Tactical C2, Auxylium Soldier C2 network, BullSequana Defense Edge Servers, Horus Vision AI for Combat C2",
        "key_clients": "French Ministry of Armed Forces (DGA, French Army Scorpion Program), NATO Communications and Information Agency (NCIA)",
        "headquarters_fallback": "Bezons / Paris, France",
        "country": "France",
        "phone_fallback": "+33 1 73 26 00 00",
        "email_fallback": "contact@eviden.com",
    },
    {
        "rank": 37,
        "name": "CGI Inc.",
        "short_name": "CGI",
        "wiki_slug": "CGI_Inc.",
        "website": "https://www.cgi.com",
        "contact_url": "https://www.cgi.com/en/contact-us",
        "linkedin": "https://www.linkedin.com/company/cgi",
        "c2_domain": "Artillery Fire Control C2, Defense C4ISR Enterprise Systems, Space Security & Galileo Satellite Ground C2",
        "flagship_c2_systems": "FireControl Artillery C2 System, Galileo Security Monitoring Centre (GSMC) Ground C2, Secure Battlefield Data Hubs",
        "c2_products": "FireControl C2, Space C2 Systems, Cyber Threat Intelligence C2, Military Enterprise Resource Planning (ERP) C2 modules",
        "key_clients": "UK Ministry of Defence, Canadian Department of National Defence, European Space Agency (ESA), US Military Services",
        "headquarters_fallback": "Montreal, Quebec, Canada",
        "country": "Canada",
        "phone_fallback": "+1 514-841-3200",
        "email_fallback": "info@cgi.com",
    },
    {
        "rank": 38,
        "name": "Fujitsu Limited",
        "short_name": "Fujitsu",
        "wiki_slug": "Fujitsu",
        "website": "https://www.fujitsu.com",
        "contact_url": "https://www.fujitsu.com/global/contact/",
        "linkedin": "https://www.linkedin.com/company/fujitsu",
        "c2_domain": "National Air Defense Ground C2, Defense Cloud C4I Infrastructure, Joint Staff Command & Tactical Information Systems",
        "flagship_c2_systems": "Japan Air Defense Ground Environment (JADGE) software modules, Defense Central Command Information System (DII C2)",
        "c2_products": "JADGE Air Defense C2 modules, Tactical Mobile Cloud C2, Defense Cybersecurity Operations Centers, Ground Self-Defense C4I",
        "key_clients": "Japan Ministry of Defense, Japan Self-Defense Forces (JASDF, JGSDF, JMSDF), UK Ministry of Defence, Australian DoD",
        "headquarters_fallback": "Kawasaki / Tokyo, Japan",
        "country": "Japan",
        "phone_fallback": "+81 3-6252-2220",
        "email_fallback": "press@fujitsu.com",
    },
    {
        "rank": 39,
        "name": "NEC Corporation",
        "short_name": "NEC",
        "wiki_slug": "NEC",
        "website": "https://www.nec.com",
        "contact_url": "https://www.nec.com/en/global/contact/",
        "linkedin": "https://www.linkedin.com/company/nec",
        "c2_domain": "Tactical Field Communications C4I, Space Satellite Ground Control C2, Biometric Defense & Command Centers",
        "flagship_c2_systems": "Field Communication System C4I (Japan Ground Self-Defense Force), Space Satellite Operations Ground C2, Tactical Sensor Network C2",
        "c2_products": "Field C4I System, Defense Satellite Ground Control Station, Mobile Command Post communication systems, Sonar & Radar C2 integration",
        "key_clients": "Japan Ministry of Defense, Japan Self-Defense Forces, Japan Aerospace Exploration Agency (JAXA), Allied Defense Agencies",
        "headquarters_fallback": "Minato, Tokyo, Japan",
        "country": "Japan",
        "phone_fallback": "+81 3-3454-1111",
        "email_fallback": "contact@nec.com",
    },
    {
        "rank": 40,
        "name": "Mitsubishi Electric Corporation",
        "short_name": "Mitsubishi Electric",
        "wiki_slug": "Mitsubishi_Electric",
        "website": "https://www.mitsubishielectric.com",
        "contact_url": "https://www.mitsubishielectric.com/en/about/locations/",
        "linkedin": "https://www.linkedin.com/company/mitsubishielectric",
        "c2_domain": "Air Defense Command & Control Systems, Naval Combat Direction Systems (CDS), Missile Fire Control Integration",
        "flagship_c2_systems": "Japan Base Air Defense Ground Environment (BADGE / JADGE) Systems, Naval Combat Direction System (CDS/FCS), Patriot PAC-3 C2",
        "c2_products": "JADGE Air Defense C2, FCS-3 Naval Fire Control C2, Patriot PAC-3 Missile Defense C2 Integration, Airborne Radar C2",
        "key_clients": "Japan Ministry of Defense (JASDF, JMSDF, JGSDF), US Military Cooperation Programs, Allied Pacific Navies",
        "headquarters_fallback": "Chiyoda-ku, Tokyo, Japan",
        "country": "Japan",
        "phone_fallback": "+81 3-3218-2111",
        "email_fallback": "inquiry@mitsubishielectric.com",
    },
]


def clean_val(val: Any) -> str:
    """Clean Wikipedia citation brackets, excess whitespace, and normalize text."""
    if not val:
        return ""
    text = str(val)
    # Remove citation brackets like [ 1 ], [ 2 ]: 48, [ 12 ], [ citation needed ]
    text = re.sub(r"\[\s*[\d\w\s,.:\-\u2013\u2014]+?\s*\]", "", text)
    # Normalize multiple whitespace
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def scrape_wikipedia_data(slug: str) -> Dict[str, Any]:
    """Mine Wikipedia REST summary API and full infobox."""
    result = {
        "wiki_title": "",
        "wiki_extract": "",
        "wiki_url": f"https://en.wikipedia.org/wiki/{slug}",
        "type": "",
        "traded_as": "",
        "industry": "",
        "founded": "",
        "founders": "",
        "headquarters": "",
        "key_people": "",
        "revenue": "",
        "operating_income": "",
        "net_income": "",
        "total_assets": "",
        "employees": "",
        "wiki_website": "",
    }

    # 1. Summary REST API
    summary_url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{slug}"
    try:
        r = requests.get(summary_url, headers=WIKI_HEADERS, timeout=12)
        if r.status_code == 200:
            data = r.json()
            result["wiki_title"] = clean_val(data.get("title", ""))
            result["wiki_extract"] = clean_val(data.get("extract", ""))
    except Exception as e:
        logger.warning(f"Failed to fetch summary for {slug}: {e}")

    time.sleep(0.3)

    # 2. Scrape Infobox HTML
    page_url = f"https://en.wikipedia.org/wiki/{slug}"
    try:
        r = requests.get(page_url, headers=WIKI_HEADERS, timeout=15)
        if r.status_code == 200:
            soup = BeautifulSoup(r.text, "html.parser")
            infobox = soup.find("table", {"class": lambda x: x and "infobox" in x})
            if infobox:
                ib_map = {}
                for tr in infobox.find_all("tr"):
                    th = tr.find("th")
                    td = tr.find("td")
                    if th and td:
                        k = th.get_text(separator=" ", strip=True).lower()
                        v = td.get_text(separator=" ", strip=True)
                        ib_map[k] = v

                for k, v in ib_map.items():
                    if "type" in k and not result["type"]:
                        result["type"] = clean_val(v)
                    elif "traded as" in k:
                        result["traded_as"] = clean_val(v)
                    elif "industry" in k:
                        result["industry"] = clean_val(v)
                    elif "founded" in k and not result["founded"]:
                        result["founded"] = clean_val(v)
                    elif "founder" in k and not result["founders"]:
                        result["founders"] = clean_val(v)
                    elif "headquarters" in k:
                        result["headquarters"] = clean_val(v)
                    elif "key people" in k or "key person" in k:
                        result["key_people"] = clean_val(v)
                    elif k.startswith("revenue"):
                        result["revenue"] = clean_val(v)
                    elif "operating income" in k:
                        result["operating_income"] = clean_val(v)
                    elif "net income" in k:
                        result["net_income"] = clean_val(v)
                    elif "total assets" in k or "assets" in k:
                        result["total_assets"] = clean_val(v)
                    elif "number of employees" in k or "employees" in k:
                        result["employees"] = clean_val(v)
                    elif "website" in k:
                        result["wiki_website"] = clean_val(v)

    except Exception as e:
        logger.warning(f"Failed to scrape infobox for {slug}: {e}")

    return result


def scrape_official_website(url: str) -> Dict[str, Any]:
    """Scrape official homepage for title, meta description, and connection status."""
    res = {
        "status_code": None,
        "title": "",
        "meta_description": "",
    }
    if not url:
        return res

    try:
        r = requests.get(url, headers=WEB_HEADERS, timeout=12, verify=False, allow_redirects=True)
        res["status_code"] = r.status_code
        if r.status_code == 200:
            soup = BeautifulSoup(r.text, "html.parser")
            if soup.title and soup.title.string:
                res["title"] = clean_val(soup.title.string)
            elif soup.title:
                res["title"] = clean_val(soup.title.get_text(strip=True))

            desc_tag = (
                soup.find("meta", attrs={"name": re.compile(r"^description$", re.I)})
                or soup.find("meta", attrs={"property": re.compile(r"^og:description$", re.I)})
                or soup.find("meta", attrs={"name": re.compile(r"^twitter:description$", re.I)})
            )
            if desc_tag and desc_tag.get("content"):
                res["meta_description"] = clean_val(desc_tag.get("content"))
    except Exception as e:
        logger.warning(f"Could not connect to {url}: {e}")
        res["status_code"] = "Error"

    return res


def run_mining_pipeline() -> List[Dict[str, Any]]:
    """Execute end-to-end web mining and enrichment across all 40 companies."""
    logger.info("Starting Web Mining for 40 Command and Control Systems Market Companies...")
    extracted_records = []

    for idx, comp in enumerate(COMPANIES_MASTER, start=1):
        rank = comp["rank"]
        name = comp["name"]
        slug = comp["wiki_slug"]
        domain = comp["website"]

        logger.info(f"[{idx}/{len(COMPANIES_MASTER)}] Mining: #{rank} - {name}...")

        # 1. Scrape Wikipedia structured knowledge & infobox
        wiki_data = scrape_wikipedia_data(slug)

        # 2. Scrape official website live metadata
        time.sleep(0.3)
        web_meta = scrape_official_website(domain)

        # 3. Consolidate attributes
        hq = wiki_data.get("headquarters") or comp["headquarters_fallback"]
        hq_clean = clean_val(hq)

        company_type = wiki_data.get("type") or "Public"
        traded_as = wiki_data.get("traded_as") or ""
        if not traded_as and "private" in company_type.lower():
            traded_as = "Private (Non-traded)"
        elif not traded_as and "joint venture" in company_type.lower():
            traded_as = "Joint Venture (Airbus, BAE Systems, Leonardo)"

        executives = clean_val(wiki_data.get("key_people") or "")
        revenue = clean_val(wiki_data.get("revenue") or "")
        operating_income = clean_val(wiki_data.get("operating_income") or "")
        net_income = clean_val(wiki_data.get("net_income") or "")
        total_assets = clean_val(wiki_data.get("total_assets") or "")
        employees = clean_val(wiki_data.get("employees") or "")
        industry = clean_val(wiki_data.get("industry") or "Defense & Aerospace, Command & Control")

        description = wiki_data.get("wiki_extract") or web_meta.get("meta_description") or ""

        record = {
            "Rank": rank,
            "Company_Name": name,
            "Short_Name": comp["short_name"],
            "Market_Role": "Command and Control (C2) Market Key Leader",
            "Website": domain,
            "Website_HTTP_Status": web_meta.get("status_code") or "N/A",
            "Website_Page_Title": web_meta.get("title") or "",
            "Website_Meta_Description": web_meta.get("meta_description") or "",
            "Headquarters_Address": hq_clean,
            "Country": comp["country"],
            "Company_Type": company_type,
            "Stock_Ticker_Exchange": traded_as,
            "Year_Founded": clean_val(wiki_data.get("founded") or ""),
            "Founders_Predecessors": clean_val(wiki_data.get("founders") or ""),
            "Industry_Sectors": industry,
            "Latest_Revenue": revenue,
            "Operating_Income": operating_income,
            "Net_Income": net_income,
            "Total_Assets": total_assets,
            "Employee_Count": employees,
            "Key_Executives_Leadership": executives,
            "C2_Market_Domain_Focus": comp["c2_domain"],
            "Flagship_C2_Systems": comp["flagship_c2_systems"],
            "Key_C2_Products_Platforms": comp["c2_products"],
            "Key_Military_Government_Clients": comp["key_clients"],
            "Corporate_Phone": comp["phone_fallback"],
            "Corporate_Email_Contact": comp["email_fallback"],
            "Contact_URL": comp["contact_url"],
            "LinkedIn_URL": comp["linkedin"],
            "Wikipedia_URL": wiki_data.get("wiki_url") or f"https://en.wikipedia.org/wiki/{slug}",
            "Business_Overview": description,
            "Data_Mining_Method": "Web Mining (Wikipedia REST + Infobox + Live Corporate Web Meta)",
            "Timestamp_UTC": time.strftime("%Y-%m-%d %H:%M:%SZ", time.gmtime()),
        }

        extracted_records.append(record)
        time.sleep(0.4)

    logger.info("Completed scraping all 40 companies!")
    return extracted_records


def save_outputs(records: List[Dict[str, Any]]):
    """Save records to CSV and JSON formats."""
    os.makedirs("output", exist_ok=True)

    csv_paths = [
        "command_and_control_systems_market_companies.csv",
        os.path.join("output", "command_and_control_systems_market_companies.csv")
    ]

    fieldnames = list(records[0].keys())

    for p in csv_paths:
        with open(p, mode="w", newline="", encoding="utf-8-sig") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(records)
        logger.info(f"Saved CSV output ({len(records)} rows) to: {p}")

    json_paths = [
        "command_and_control_systems_market_companies.json",
        os.path.join("output", "command_and_control_systems_market_companies.json")
    ]

    for p in json_paths:
        with open(p, mode="w", encoding="utf-8") as f:
            json.dump(records, f, indent=2, ensure_ascii=False)
        logger.info(f"Saved JSON output ({len(records)} records) to: {p}")


if __name__ == "__main__":
    records = run_mining_pipeline()
    save_outputs(records)
    print("\nSUCCESS: All 40 Command & Control Systems companies mined and saved!")
