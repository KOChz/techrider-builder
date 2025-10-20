import React from "react";

import { createServerClientService } from "@/lib/supabase/server";

import StagePlan from "@/components/stage-plan/stage-plan";
import Link from "next/link";

import "./headeache-techrider.css";
import { MemberCard, TBandMember } from "@/components/member-card/member-card";

export const bandMembers: TBandMember[] = [
  {
    id: "danya",
    name: "Danya",
    icon: "🥁",
    role: "Drums",
    equipment: [
      {
        name: "Bass drum",
        quantity: "× 1",
        examples: {
          title: "Recommended Brands",
          items: [
            'DW Performance Series 22"',
            'Yamaha Stage Custom 22"',
            'Pearl Export 22"',
            'Tama Superstar 22"',
          ],
        },
      },
      {
        name: "Snare",
        quantity: "× 1",
        examples: {
          title: "Recommended Models",
          items: [
            'Ludwig Supraphonic 14"×6.5"',
            'Pearl Sensitone Steel 14"×5"',
            'Yamaha Recording Custom 14"×5.5"',
            'DW Collector\'s Maple 14"×6"',
          ],
        },
      },
      {
        name: 'High tom 12"',
        quantity: "× 1",
      },
      {
        name: 'Mid tom 14"',
        quantity: "× 1",
      },
      {
        name: "Floor tom",
        quantity: "× 1",
        examples: {
          title: "Typical Sizes",
          items: [
            '16"×16" (standard)',
            '14"×14" (compact)',
            '18"×16" (deep tone)',
          ],
        },
      },
      {
        name: "Hi-hat stand",
        quantity: "× 1",
      },
      {
        name: "Boom cymbal stands",
        quantity: "× 2",
      },
      {
        name: "Snare stand",
        quantity: "× 1",
      },
      {
        name: "Floor monitor (wedge)",
        examples: {
          title: "Professional Options",
          items: [
            'QSC K12.2 (12", 2000W)',
            'Yamaha DXR12 (12", 1100W)',
            'JBL PRX412M (12", 1200W)',
            'EV ELX112P (12", 1000W)',
          ],
        },
      },
      {
        name: "Wireless in-ear monitoring system",
        quantity: "(ear monitors provided)",
        examples: {
          title: "Compatible Systems",
          items: [
            "Shure PSM 300 / PSM 900",
            "Sennheiser EW IEM G4",
            "Audio-Technica M3",
            "Frequency range: 520-865 MHz",
          ],
        },
      },
      {
        name: "Drum rug",
        examples: {
          title: "Recommended Size",
          items: ["Minimum 6' × 8' (183cm × 244cm)", "Non-slip rubber backing"],
        },
      },
    ],
  },
  {
    id: "kyrylo",
    name: "Kyrylo",
    icon: "🎸",
    role: "Bass",
    equipment: [
      {
        name: "Bass combo amp/stack",
        examples: {
          title: "Recommended Amps",
          items: [
            "Ampeg SVT-410HLF + SVT-3 Pro",
            "Fender Rumble 500 combo",
            "Gallien-Krueger MB212",
            "Markbass CMD 121H combo",
            "Minimum 300W recommended",
          ],
        },
      },
      {
        name: "Spare Jack-to-Jack cable >5m",
        quantity: "× 2",
        examples: {
          title: "Professional Cables",
          items: ["Length: 3-6m minimum"],
        },
      },
      {
        name: "Floor monitor (wedge)",
        examples: {
          title: "Professional Options",
          items: [
            'QSC K12.2 (12", 2000W)',
            'Yamaha DXR12 (12", 1100W)',
            'JBL PRX412M (12", 1200W)',
          ],
        },
      },
      {
        name: "Bass guitar stand",
      },
      {
        name: "Power outlet / extension cord",
        examples: {
          title: "Requirements",
          items: [
            "Standard AC power (220-240V EU / 110-120V US)",
            "5m+ extension cord if needed",
            "Grounded outlets preferred",
          ],
        },
      },
    ],
  },
  {
    id: "kristina",
    name: "Kristina",
    icon: "🎤",
    role: "Guitar / Vocals",
    equipment: [
      {
        name: "Guitar combo amplifier",
        quantity: "(Fender / VOX / Roland)",
        examples: {
          title: "Recommended Models",
          items: [
            "Fender Hot Rod Deluxe (40W)",
            "VOX AC30 (30W)",
            "Roland JC-120 Jazz Chorus",
            "Fender Blues Deluxe (40W)",
            "Minimum 30W tube / 50W solid state",
          ],
        },
      },
      {
        name: "Guitar stand",
      },
      {
        name: "Microphone stand",
        examples: {
          title: "Stand Types",
          items: [
            "Boom stand with adjustable arm",
            "Height: adjustable to 1.5-2m",
            "Heavy base for stability",
          ],
        },
      },
      {
        name: "Microphone",
        examples: {
          title: "Vocal Microphones",
          items: [
            "Shure SM58 (industry standard)",
            "Shure Beta 58A (brighter tone)",
            "Sennheiser e935 (clear highs)",
            "Sennheiser e945 (supercardioid)",
            "Audio-Technica ATM710",
          ],
        },
      },
      {
        name: "Spare Jack-to-Jack cable >5m",
        quantity: "× 2",
        examples: {
          title: "Professional Cables",
          items: [
            "Mogami Gold 15ft / 4.5m (6.35mm)",
            "Planet Waves American Stage 15ft",
            "Fender Professional Series 15ft",
            "D'Addario Circuit Breaker 15ft",
            "Length: 3-5m (10-15ft) minimum",
          ],
        },
      },
      {
        name: "Floor monitor (wedge)",
        examples: {
          title: "Professional Options",
          items: [
            'QSC K12.2 (12", 2000W)',
            'Yamaha DXR12 (12", 1100W)',
            'JBL PRX412M (12", 1200W)',
          ],
        },
      },
      {
        name: "Wireless in-ear monitoring system",
        quantity: "(ear monitors provided)",
        examples: {
          title: "Compatible Systems",
          items: [
            "Shure PSM 300 / PSM 900",
            "Sennheiser EW IEM G4",
            "Audio-Technica M3",
          ],
        },
      },
      {
        name: "Power outlet / extension cord",
        examples: {
          title: "Requirements",
          items: [
            "Standard AC power (220-240V EU)",
            "5m+ extension cord if needed",
            "Grounded outlets preferred",
          ],
        },
      },
    ],
  },
  {
    id: "maksym",
    name: "Maksym",
    icon: "🎸",
    role: "Guitar",
    equipment: [
      {
        name: "Guitar combo amplifier",
        quantity: "(Fender / VOX / Roland)",
        examples: {
          title: "Recommended Models",
          items: [
            "Fender Hot Rod Deluxe (40W)",
            "VOX AC30 (30W)",
            "Roland JC-120 Jazz Chorus",
            "Fender Blues Deluxe (40W)",
            "Minimum 30W tube / 50W solid state",
          ],
        },
      },
      {
        name: "Guitar stand",
      },
      {
        name: "Microphone",
        examples: {
          title: "Backing Vocal Mics",
          items: [
            "Shure SM58 (industry standard)",
            "Shure Beta 58A",
            "Sennheiser e835",
            "Audio-Technica ATM510",
          ],
        },
      },
      {
        name: "Spare Jack-to-Jack cable >5m",
        quantity: "× 2",
        examples: {
          title: "Professional Cables",
          items: [
            "Mogami Gold 15ft / 4.5m (6.35mm)",
            "Planet Waves American Stage 15ft",
            "Fender Professional Series 15ft",
            "Length: 3-5m (10-15ft) minimum",
          ],
        },
      },
      {
        name: "Floor monitor (wedge)",
        examples: {
          title: "Professional Options",
          items: [
            'QSC K12.2 (12", 2000W)',
            'Yamaha DXR12 (12", 1100W)',
            'JBL PRX412M (12", 1200W)',
          ],
        },
      },
      {
        name: "Power outlet / extension cord",
        examples: {
          title: "Requirements",
          items: [
            "Standard AC power (220-240V EU)",
            "5m+ extension cord if needed",
            "Grounded outlets preferred",
          ],
        },
      },
    ],
  },
];

export default async function TechRider() {
  const supabase = await createServerClientService();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <nav>
        <div className="nav-container">
          <a href="#home" className="logo">
            headachee
          </a>
          <ul className="nav-links">
            <li className="dropdown">
              <button
                className="dropdown-toggle"
                aria-haspopup="true"
                aria-expanded="false"
                id="techRiderToggle"
              >
                Tech Rider
              </button>
              <div
                className="dropdown-menu"
                role="menu"
                aria-labelledby="techRiderToggle"
              >
                <a
                  href="#danya"
                  id="dropdown-danya"
                  className="dropdown-item"
                  role="menuitem"
                >
                  <span className="dropdown-icon">🥁</span>
                  <div className="dropdown-info">
                    <span className="dropdown-name">Danya</span>
                    <span className="dropdown-role">Drums</span>
                  </div>
                </a>

                <a
                  href="#kyrylo"
                  id="dropdown-kyrylo"
                  className="dropdown-item"
                  role="menuitem"
                >
                  <span className="dropdown-icon">🎸</span>
                  <div className="dropdown-info">
                    <span className="dropdown-name">Kyrylo</span>
                    <span className="dropdown-role">Bass</span>
                  </div>
                </a>

                <a
                  href="#kristina"
                  id="dropdown-kristina"
                  className="dropdown-item"
                  role="menuitem"
                >
                  <span className="dropdown-icon">🎤</span>
                  <div className="dropdown-info">
                    <span className="dropdown-name">Kristina</span>
                    <span className="dropdown-role">Guitar / Vocals</span>
                  </div>
                </a>

                <a
                  href="#maksym"
                  id="dropdown-maksym"
                  className="dropdown-item"
                  role="menuitem"
                >
                  <span className="dropdown-icon">🎸</span>
                  <div className="dropdown-info">
                    <span className="dropdown-name">Maksym</span>
                    <span className="dropdown-role">Guitar</span>
                  </div>
                </a>

                <a
                  href="#stage-plan"
                  id="dropdown-stage-plan"
                  className="dropdown-item"
                  role="menuitem"
                >
                  <span className="dropdown-icon">🏟️</span>
                  <div className="dropdown-info">
                    <span className="dropdown-name">Stage Plan</span>
                  </div>
                </a>
              </div>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>

            {user && (
              <li>
                <Link
                  href="/dashboard/my-projects"
                  type="submit"
                  className="px-3 cursor-pointer py-1.5 rounded-md text-slate-200 hover:bg-green-800 transition-colors"
                  aria-label="Home"
                >
                  Home
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>

      <section id="home" className="hero">
        <div>
          <h1>headachee</h1>
          <a href="#tech-rider" className="cta-button">
            View Tech Rider
          </a>
        </div>
      </section>

      <section id="tech-rider" className="container">
        <h2 className="section-title">Technical Requirements</h2>

        <div className="tech-grid">
          {bandMembers.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      </section>

      <StagePlan />

      <footer className="w-full" id="contact">
        <h3>Get in Touch</h3>
        <p>For bookings and technical questions:</p>
        <p>
          <a href="mailto:kristinaheadachee@gmail.com">
            kristinaheadachee@gmail.com
          </a>
        </p>
        <p style={{ marginTop: "var(--spacing-md)", fontSize: "0.85rem" }}>
          © 2025 headachee. All rights reserved.
        </p>
      </footer>
    </>
  );
}
