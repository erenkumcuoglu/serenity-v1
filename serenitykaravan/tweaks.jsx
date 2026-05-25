/* tweaks.jsx — Serenity v2 design tweaks */

const TWEAK_DEFAULTS = window.__SERENITY_TWEAKS__ || {
  accent: "#2BB5C8",
  accentDeep: "#1A8C9C",
  typography: "modern",
  parallax: 1,
  heroDark: true,
};

const TYPOGRAPHY_PRESETS = {
  modern:    { sans: "'DM Sans'", serif: "'Instrument Serif'", import: "family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Instrument+Serif:ital@0;1" },
  editorial: { sans: "'Fraunces'", serif: "'Fraunces'", import: "family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600" },
  tech:      { sans: "'Manrope'", serif: "'Instrument Serif'", import: "family=Manrope:wght@400;500;600;700&family=Instrument+Serif:ital@0;1" },
};

const ACCENT_OPTIONS = [
  ["#2BB5C8", "#1A8C9C"],   // turkuaz (default)
  ["#0A4D6E", "#02263B"],   // deep ocean
  ["#5BC9B0", "#2A9A87"],   // mint/aqua
  ["#C8901E", "#8E6814"],   // gold
  ["#0D0D0D", "#000000"],   // mono
];

function applyTweaks(t) {
  const root = document.documentElement;
  root.style.setProperty("--teal", t.accent);
  root.style.setProperty("--teal-deep", t.accentDeep);
  root.style.setProperty("--plx", t.parallax);

  const preset = TYPOGRAPHY_PRESETS[t.typography] || TYPOGRAPHY_PRESETS.modern;
  root.style.setProperty("--font-sans", preset.sans + ",-apple-system,BlinkMacSystemFont,sans-serif");
  root.style.setProperty("--font-serif", preset.serif + ",Georgia,serif");

  // lazy load extra fonts when needed (editorial/tech)
  if (preset.import && t.typography !== "modern") {
    const id = "twkFontPreset";
    let link = document.getElementById(id);
    if (!link) {
      link = document.createElement("link");
      link.id = id; link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    link.href = `https://fonts.googleapis.com/css2?${preset.import}&display=swap`;
  }

  // hero brightness
  document.body.classList.toggle("hero-light", !t.heroDark);
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  React.useEffect(() => { applyTweaks(t); }, [t]);

  const setAccentPair = (pair) => {
    setTweak({ accent: pair[0], accentDeep: pair[1] });
  };

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Tipografi" />
      <TweakRadio
        label="Stil"
        value={t.typography}
        options={["modern", "editorial", "tech"]}
        onChange={(v) => setTweak("typography", v)}
      />

      <TweakSection label="Aksan rengi" />
      <TweakColor
        label="Palet"
        value={[t.accent, t.accentDeep]}
        options={ACCENT_OPTIONS}
        onChange={setAccentPair}
      />

      <TweakSection label="Hareket" />
      <TweakSlider
        label="Parallax yoğunluğu"
        value={t.parallax}
        min={0} max={2} step={0.1}
        onChange={(v) => setTweak("parallax", v)}
      />
    </TweaksPanel>
  );
}

const mount = document.createElement("div");
document.body.appendChild(mount);
ReactDOM.createRoot(mount).render(<App />);

// apply initial tweaks immediately (before React mounts) so first paint is correct
applyTweaks(TWEAK_DEFAULTS);
