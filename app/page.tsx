import React from "react";
import { redirect } from "next/navigation";

import { createServerClient } from "@/lib/supabase/server";

import StagePlan from "@/components/stage-plan/stage-plan";
import { signOutAction } from "./actions/sign-out-action/sign-out-action";

export default async function TechRider() {
  const supabase = await createServerClient();

  console.log("Fixing build issues;");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }
  return (
    <>
      <nav>
        <div className="nav-container">
          <a href="#home" className="logo">
            headachee
          </a>
          <ul className="nav-links">
            {/* <li><a href="#home">Home</a></li> */}
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

            <li>
              <form action={signOutAction}>
                <input type="hidden" name="redirectTo" value="/login" />
                <button
                  type="submit"
                  className="px-3 cursor-pointer py-1.5 rounded-md border border-slate-700 text-slate-200 hover:bg-slate-800 transition-colors"
                  aria-label="Sign out"
                >
                  Sign out
                </button>
              </form>
            </li>
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
          <div className="member-card" id="danya">
            <div className="member-header">
              <span className="member-icon">🥁</span>
              <div className="member-info">
                <h3>Danya</h3>
                <p className="member-role">Drums</p>
              </div>
            </div>
            <ul className="equipment-list">
              <details className="equipment-item">
                <summary>
                  <span>
                    Bass drum <span className="quantity">× 1</span>
                  </span>
                </summary>
                <div className="examples">
                  <p className="examples-title">Recommended Brands</p>
                  <ul className="examples-list">
                    <li>DW Performance Series 22"</li>
                    <li>Yamaha Stage Custom 22"</li>
                    <li>Pearl Export 22"</li>
                    <li>Tama Superstar 22"</li>
                  </ul>
                </div>
              </details>
              <details className="equipment-item">
                <summary>
                  <span>
                    Snare <span className="quantity">× 1</span>
                  </span>
                </summary>
                <div className="examples">
                  <p className="examples-title">Recommended Models</p>
                  <ul className="examples-list">
                    <li>Ludwig Supraphonic 14"×6.5"</li>
                    <li>Pearl Sensitone Steel 14"×5"</li>
                    <li>Yamaha Recording Custom 14"×5.5"</li>
                    <li>DW Collector's Maple 14"×6"</li>
                  </ul>
                </div>
              </details>
              <li className="equipment-simple">
                <span>
                  High tom 12" <span className="quantity">× 1</span>
                </span>
              </li>
              <li className="equipment-simple">
                <span>
                  Mid tom 14" <span className="quantity">× 1</span>
                </span>
              </li>
              <details className="equipment-item">
                <summary>
                  <span>
                    Floor tom <span className="quantity">× 1</span>
                  </span>
                </summary>
                <div className="examples">
                  <p className="examples-title">Typical Sizes</p>
                  <ul className="examples-list">
                    <li>16"×16" (standard)</li>
                    <li>14"×14" (compact)</li>
                    <li>18"×16" (deep tone)</li>
                  </ul>
                </div>
              </details>
              <details className="equipment-item">
                <summary>
                  <span>
                    Hi-hat stand <span className="quantity">× 1</span>
                  </span>
                </summary>
              </details>
              <details className="equipment-item">
                <summary>
                  <span>
                    Boom cymbal stands <span className="quantity">× 2</span>
                  </span>
                </summary>
              </details>
              <details className="equipment-item">
                <summary>
                  <span>
                    Snare stand <span className="quantity">× 1</span>
                  </span>
                </summary>
              </details>
              <details className="equipment-item">
                <summary>
                  <span>Floor monitor (wedge)</span>
                </summary>
                <div className="examples">
                  <p className="examples-title">Professional Options</p>
                  <ul className="examples-list">
                    <li>QSC K12.2 (12", 2000W)</li>
                    <li>Yamaha DXR12 (12", 1100W)</li>
                    <li>JBL PRX412M (12", 1200W)</li>
                    <li>EV ELX112P (12", 1000W)</li>
                  </ul>
                </div>
              </details>
              <details className="equipment-item">
                <summary>
                  <span>
                    Wireless in-ear monitoring system
                    <span className="quantity">(ear monitors provided)</span>
                  </span>
                </summary>
                <div className="examples">
                  <p className="examples-title">Compatible Systems</p>
                  <ul className="examples-list">
                    <li>Shure PSM 300 / PSM 900</li>
                    <li>Sennheiser EW IEM G4</li>
                    <li>Audio-Technica M3</li>
                    <li>Frequency range: 520-865 MHz</li>
                  </ul>
                </div>
              </details>
              <details className="equipment-item">
                <summary>
                  <span>Drum rug</span>
                </summary>
                <div className="examples">
                  <p className="examples-title">Recommended Size</p>
                  <ul className="examples-list">
                    <li>Minimum 6' × 8' (183cm × 244cm)</li>
                    <li>Non-slip rubber backing</li>
                  </ul>
                </div>
              </details>
            </ul>
          </div>

          <div className="member-card" id="kyrylo">
            <div className="member-header">
              <span className="member-icon">🎸</span>
              <div className="member-info">
                <h3>Kyrylo</h3>
                <p className="member-role">Bass</p>
              </div>
            </div>
            <ul className="equipment-list">
              <details className="equipment-item">
                <summary>
                  <span>Bass combo amp/stack</span>
                </summary>
                <div className="examples">
                  <p className="examples-title">Recommended Amps</p>
                  <ul className="examples-list">
                    <li>Ampeg SVT-410HLF + SVT-3 Pro</li>
                    <li>Fender Rumble 500 combo</li>
                    <li>Gallien-Krueger MB212</li>
                    <li>Markbass CMD 121H combo</li>
                    <li>Minimum 300W recommended</li>
                  </ul>
                </div>
              </details>
              <details className="equipment-item">
                <summary>
                  <span>
                    Spare Jack-to-Jack cable &gt;5m{" "}
                    <span className="quantity">× 2</span>
                  </span>
                </summary>
                <div className="examples">
                  <p className="examples-title">Professional Cables</p>
                  <ul className="examples-list">
                    <li>Length: 3-6m minimum</li>
                  </ul>
                </div>
              </details>
              <details className="equipment-item">
                <summary>
                  <span>Floor monitor (wedge)</span>
                </summary>
                <div className="examples">
                  <p className="examples-title">Professional Options</p>
                  <ul className="examples-list">
                    <li>QSC K12.2 (12", 2000W)</li>
                    <li>Yamaha DXR12 (12", 1100W)</li>
                    <li>JBL PRX412M (12", 1200W)</li>
                  </ul>
                </div>
              </details>
              <details className="equipment-item">
                <summary>
                  <span>Bass guitar stand</span>
                </summary>
              </details>
              <details className="equipment-item">
                <summary>
                  <span>Power outlet / extension cord</span>
                </summary>
                <div className="examples">
                  <p className="examples-title">Requirements</p>
                  <ul className="examples-list">
                    <li>Standard AC power (220-240V EU / 110-120V US)</li>
                    <li>5m+ extension cord if needed</li>
                    <li>Grounded outlets preferred</li>
                  </ul>
                </div>
              </details>
            </ul>
          </div>

          <div className="member-card" id="kristina">
            <div className="member-header">
              <span className="member-icon">🎤</span>
              <div className="member-info">
                <h3>Kristina</h3>
                <p className="member-role">Guitar / Vocals</p>
              </div>
            </div>
            <ul className="equipment-list">
              <details className="equipment-item">
                <summary>
                  <span>
                    Guitar combo amplifier{" "}
                    <span className="quantity">(Fender / VOX / Roland)</span>
                  </span>
                </summary>
                <div className="examples">
                  <p className="examples-title">Recommended Models</p>
                  <ul className="examples-list">
                    <li>Fender Hot Rod Deluxe (40W)</li>
                    <li>VOX AC30 (30W)</li>
                    <li>Roland JC-120 Jazz Chorus</li>
                    <li>Fender Blues Deluxe (40W)</li>
                    <li>Minimum 30W tube / 50W solid state</li>
                  </ul>
                </div>
              </details>
              <details className="equipment-item">
                <summary>
                  <span>Guitar stand</span>
                </summary>
              </details>
              <details className="equipment-item">
                <summary>
                  <span>Microphone stand</span>
                </summary>
                <div className="examples">
                  <p className="examples-title">Stand Types</p>
                  <ul className="examples-list">
                    <li>Boom stand with adjustable arm</li>
                    <li>Height: adjustable to 1.5-2m</li>
                    <li>Heavy base for stability</li>
                  </ul>
                </div>
              </details>
              <details className="equipment-item">
                <summary>
                  <span>Microphone</span>
                </summary>
                <div className="examples">
                  <p className="examples-title">Vocal Microphones</p>
                  <ul className="examples-list">
                    <li>Shure SM58 (industry standard)</li>
                    <li>Shure Beta 58A (brighter tone)</li>
                    <li>Sennheiser e935 (clear highs)</li>
                    <li>Sennheiser e945 (supercardioid)</li>
                    <li>Audio-Technica ATM710</li>
                  </ul>
                </div>
              </details>
              <details className="equipment-item">
                <summary>
                  <span>
                    Spare Jack-to-Jack cable &gt;5m{" "}
                    <span className="quantity">× 2</span>
                  </span>
                </summary>
                <div className="examples">
                  <p className="examples-title">Professional Cables</p>
                  <ul className="examples-list">
                    <li>Mogami Gold 15ft / 4.5m (6.35mm)</li>
                    <li>Planet Waves American Stage 15ft</li>
                    <li>Fender Professional Series 15ft</li>
                    <li>D'Addario Circuit Breaker 15ft</li>
                    <li>Length: 3-5m (10-15ft) minimum</li>
                  </ul>
                </div>
              </details>
              <details className="equipment-item">
                <summary>
                  <span>Floor monitor (wedge)</span>
                </summary>
                <div className="examples">
                  <p className="examples-title">Professional Options</p>
                  <ul className="examples-list">
                    <li>QSC K12.2 (12", 2000W)</li>
                    <li>Yamaha DXR12 (12", 1100W)</li>
                    <li>JBL PRX412M (12", 1200W)</li>
                  </ul>
                </div>
              </details>
              <details className="equipment-item">
                <summary>
                  <span>
                    Wireless in-ear monitoring system
                    <span className="quantity">(ear monitors provided)</span>
                  </span>
                </summary>
                <div className="examples">
                  <p className="examples-title">Compatible Systems</p>
                  <ul className="examples-list">
                    <li>Shure PSM 300 / PSM 900</li>
                    <li>Sennheiser EW IEM G4</li>
                    <li>Audio-Technica M3</li>
                  </ul>
                </div>
              </details>
              <details className="equipment-item">
                <summary>
                  <span>Power outlet / extension cord</span>
                </summary>
                <div className="examples">
                  <p className="examples-title">Requirements</p>
                  <ul className="examples-list">
                    <li>Standard AC power (220-240V EU)</li>
                    <li>5m+ extension cord if needed</li>
                    <li>Grounded outlets preferred</li>
                  </ul>
                </div>
              </details>
            </ul>
          </div>

          <div className="member-card" id="maksym">
            <div className="member-header">
              <span className="member-icon">🎸</span>
              <div className="member-info">
                <h3>Maksym</h3>
                <p className="member-role">Guitar</p>
              </div>
            </div>
            <ul className="equipment-list">
              <details className="equipment-item">
                <summary>
                  <span>
                    Guitar combo amplifier{" "}
                    <span className="quantity">(Fender / VOX / Roland)</span>
                  </span>
                </summary>
                <div className="examples">
                  <p className="examples-title">Recommended Models</p>
                  <ul className="examples-list">
                    <li>Fender Hot Rod Deluxe (40W)</li>
                    <li>VOX AC30 (30W)</li>
                    <li>Roland JC-120 Jazz Chorus</li>
                    <li>Fender Blues Deluxe (40W)</li>
                    <li>Minimum 30W tube / 50W solid state</li>
                  </ul>
                </div>
              </details>
              <details className="equipment-item">
                <summary>
                  <span>Guitar stand</span>
                </summary>
              </details>
              <details className="equipment-item">
                <summary>
                  <span>Microphone</span>
                </summary>
                <div className="examples">
                  <p className="examples-title">Backing Vocal Mics</p>
                  <ul className="examples-list">
                    <li>Shure SM58 (industry standard)</li>
                    <li>Shure Beta 58A</li>
                    <li>Sennheiser e835</li>
                    <li>Audio-Technica ATM510</li>
                  </ul>
                </div>
              </details>
              <details className="equipment-item">
                <summary>
                  <span>
                    Spare Jack-to-Jack cable &gt;5m{" "}
                    <span className="quantity">× 2</span>
                  </span>
                </summary>
                <div className="examples">
                  <p className="examples-title">Professional Cables</p>
                  <ul className="examples-list">
                    <li>Mogami Gold 15ft / 4.5m (6.35mm)</li>
                    <li>Planet Waves American Stage 15ft</li>
                    <li>Fender Professional Series 15ft</li>
                    <li>Length: 3-5m (10-15ft) minimum</li>
                  </ul>
                </div>
              </details>
              <details className="equipment-item">
                <summary>
                  <span>Floor monitor (wedge)</span>
                </summary>
                <div className="examples">
                  <p className="examples-title">Professional Options</p>
                  <ul className="examples-list">
                    <li>QSC K12.2 (12", 2000W)</li>
                    <li>Yamaha DXR12 (12", 1100W)</li>
                    <li>JBL PRX412M (12", 1200W)</li>
                  </ul>
                </div>
              </details>
              <details className="equipment-item">
                <summary>
                  <span>Power outlet / extension cord</span>
                </summary>
                <div className="examples">
                  <p className="examples-title">Requirements</p>
                  <ul className="examples-list">
                    <li>Standard AC power (220-240V EU)</li>
                    <li>5m+ extension cord if needed</li>
                    <li>Grounded outlets preferred</li>
                  </ul>
                </div>
              </details>
            </ul>
          </div>
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
