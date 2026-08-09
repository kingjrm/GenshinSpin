export interface Boss {
  name: string;
  category: "World Boss" | "Weekly Boss" | "Local Legend";
  region: "Mondstadt" | "Liyue" | "Inazuma" | "Sumeru" | "Fontaine" | "Natlan" | "Snezhnaya" | "Nod-Krai" | "None";
  apiId?: string;
  wikiFilename?: string;
}

export const worldBosses: Boss[] = [
  { name: "Anemo Hypostasis", category: "World Boss", region: "Mondstadt", wikiFilename: "Enemy_Anemo_Hypostasis.png" },
  { name: "Cryo Hypostasis", category: "World Boss", region: "Mondstadt", wikiFilename: "Enemy_Cryo_Hypostasis.png" },
  { name: "Cryo Regisvine", category: "World Boss", region: "Mondstadt", wikiFilename: "Enemy_Cryo_Regisvine.png" },
  { name: "Electro Hypostasis", category: "World Boss", region: "Mondstadt", wikiFilename: "Enemy_Electro_Hypostasis.png" },
  { name: "Watcher - Fallen Vigil", category: "World Boss", region: "Mondstadt", wikiFilename: "Enemy_Watcher_-_Fallen_Vigil.png" },
  { name: "Geo Hypostasis", category: "World Boss", region: "Liyue", wikiFilename: "Enemy_Geo_Hypostasis.png" },
  { name: "Oceanid", category: "World Boss", region: "Liyue", wikiFilename: "Enemy_Oceanid.png" },
  { name: "Primo Geovishap", category: "World Boss", region: "Liyue", wikiFilename: "Enemy_Primo_Geovishap.png" },
  { name: "Pyro Regisvine", category: "World Boss", region: "Liyue", wikiFilename: "Enemy_Pyro_Regisvine.png" },
  { name: "Ruin Serpent", category: "World Boss", region: "Liyue", wikiFilename: "Enemy_Ruin_Serpent.png" },
  { name: "Solitary Suanni", category: "World Boss", region: "Liyue", wikiFilename: "Enemy_Solitary_Suanni.png" },
  { name: "Bathysmal Vishap Herd", category: "World Boss", region: "Inazuma", wikiFilename: "Enemy_Coral_Defenders.png" },
  { name: "Golden Wolflord", category: "World Boss", region: "Inazuma", wikiFilename: "Enemy_Golden_Wolflord.png" },
  { name: "Hydro Hypostasis", category: "World Boss", region: "Inazuma", wikiFilename: "Enemy_Hydro_Hypostasis.png" },
  { name: "Maguu Kenki", category: "World Boss", region: "Inazuma", wikiFilename: "Enemy_Maguu_Kenki.png" },
  { name: "Perpetual Mechanical Array", category: "World Boss", region: "Inazuma", wikiFilename: "Enemy_Perpetual_Mechanical_Array.png" },
  { name: "Pyro Hypostasis", category: "World Boss", region: "Inazuma", wikiFilename: "Enemy_Pyro_Hypostasis.png" },
  { name: "Thunder Manifestation", category: "World Boss", region: "Inazuma", wikiFilename: "Enemy_Thunder_Manifestation.png" },
  { name: "Jadeplume Terrorshroom", category: "World Boss", region: "Sumeru", wikiFilename: "Enemy_Jadeplume_Terrorshroom.png" },
  { name: "Electro Regisvine", category: "World Boss", region: "Sumeru", wikiFilename: "Enemy_Electro_Regisvine.png" },
  { name: "Aeonblight Drake", category: "World Boss", region: "Sumeru", wikiFilename: "Enemy_Aeonblight_Drake.png" },
  { name: "Algorithm of Semi-Intransient Matrix of Overseer Network", category: "World Boss", region: "Sumeru", wikiFilename: "Enemy_Algorithm_of_Semi-Intransient_Matrix_of_Overseer_Network.png" },
  { name: "Dendro Hypostasis", category: "World Boss", region: "Sumeru", wikiFilename: "Enemy_Dendro_Hypostasis.png" },
  { name: "Setekh Wenut", category: "World Boss", region: "Sumeru", wikiFilename: "Enemy_Setekh_Wenut.png" },
  { name: "Iniquitous Baptist", category: "World Boss", region: "Sumeru", wikiFilename: "Enemy_Iniquitous_Baptist.png" },
  { name: "Icewind Suite", category: "World Boss", region: "Fontaine", wikiFilename: "Enemy_Icewind_Suite_-_Dirge_of_Coppelia.png" },
  { name: "Emperor of Fire and Iron", category: "World Boss", region: "Fontaine", wikiFilename: "Enemy_Emperor_of_Fire_and_Iron.png" },
  { name: "Experimental Field Generator", category: "World Boss", region: "Fontaine", wikiFilename: "Enemy_Experimental_Field_Generator.png" },
  { name: "Millennial Pearl Seahorse", category: "World Boss", region: "Fontaine", wikiFilename: "Enemy_Millennial_Pearl_Seahorse.png" },
  { name: "Hydro Tulpa", category: "World Boss", region: "Fontaine", wikiFilename: "Enemy_Hydro_Tulpa.png" },
  { name: "Legatus Golem", category: "World Boss", region: "Fontaine", wikiFilename: "Enemy_Legatus_Golem.png" },
  { name: "Goldflame Qucusaur Tyrant", category: "World Boss", region: "Natlan", wikiFilename: "Enemy_Goldflame_Qucusaur_Tyrant.png" },
  { name: "Gluttonous Yumkasaur Mountain King", category: "World Boss", region: "Natlan", wikiFilename: "Enemy_Gluttonous_Yumkasaur_Mountain_King.png" },
  { name: "Secret Source Automaton - Configuration Device", category: "World Boss", region: "Natlan", wikiFilename: "Enemy_Secret_Source_Automaton_-_Configuration_Device.png" },
  { name: "Tenebrous Papilla", category: "World Boss", region: "Natlan", wikiFilename: "Enemy_Tenebrous_Papilla.png" },
  { name: "Wayward Hermetic Spiritspeaker", category: "World Boss", region: "Natlan", wikiFilename: "Enemy_Wayward_Hermetic_Spiritspeaker.png" },
  { name: "Lava Dragon Statue", category: "World Boss", region: "Natlan", wikiFilename: "Enemy_Lava_Dragon_Statue.png" },
  { name: "Secret Source Automaton: Overseer Device", category: "World Boss", region: "Natlan", wikiFilename: "Enemy_Secret_Source_Automaton_Overseer_Device.png" },
  { name: "Radiant Moonfly", category: "World Boss", region: "Natlan", wikiFilename: "Enemy_Radiant_Moonfly.png" },
  { name: "Knuckle Duckle", category: "World Boss", region: "Natlan", wikiFilename: "Enemy_Knuckle_Duckle.png" },
  { name: "Frostnight Herra", category: "World Boss", region: "Natlan", wikiFilename: "Enemy_Frostnight_Herra.png" },
  { name: "Super-Heavy Landrover: Mechanized Fortress", category: "World Boss", region: "Natlan", wikiFilename: "Enemy_Super-Heavy_Landrover_Mechanized_Fortress.png" },
  { name: "Lord of the Hidden Depths - Whisperer of Nightmares", category: "World Boss", region: "Natlan", wikiFilename: "Enemy_Lord_of_the_Hidden_Depths_-_Whisperer_of_Nightmares.png" },
  { name: "Radiant Moongecko", category: "World Boss", region: "Natlan", wikiFilename: "Enemy_Radiant_Moongecko.png" },
  { name: "Chimeric Winged Lion", category: "World Boss", region: "Natlan", wikiFilename: "Enemy_Chimeric_Winged_Lion.png" },
  { name: "Immortal Construct", category: "World Boss", region: "Natlan", wikiFilename: "Enemy_Immortal_Construct.png" }
];

export const weeklyBosses: Boss[] = [
  { name: "Stormterror Dvalin", category: "Weekly Boss", region: "Mondstadt", apiId: "stormterror" },
  { name: "Lupus Boreas", category: "Weekly Boss", region: "Mondstadt", apiId: "lupus-boreas" },
  { name: "Childe", category: "Weekly Boss", region: "Liyue", apiId: "childe" },
  { name: "Azhdaha", category: "Weekly Boss", region: "Liyue", apiId: "azhdaha" },
  { name: "La Signora", category: "Weekly Boss", region: "Inazuma", apiId: "la-signora" },
  { name: "Raiden Shogun", category: "Weekly Boss", region: "Inazuma", apiId: "magatsu-mitake-narukami-no-mikoto" },
  { name: "Scaramouche Boss", category: "Weekly Boss", region: "Sumeru", apiId: "everlasting-lord-of-arcane-wisdom" },
  { name: "Guardian of Apep's Oasis", category: "Weekly Boss", region: "Sumeru", apiId: "guardian-of-apep-s-oasis" },
  { name: "All-Devouring Narwhal", category: "Weekly Boss", region: "Fontaine", apiId: "all-devouring-narwhal" },
  { name: "The Knave - Arlecchino", category: "Weekly Boss", region: "Fontaine", apiId: "the-knave" },
  { name: "Lord of Eroded Primal Fire", category: "Weekly Boss", region: "Natlan", wikiFilename: "Enemy_Lord_of_Eroded_Primal_Fire.png" },
  { name: "The Game Before the Gate", category: "Weekly Boss", region: "Nod-Krai", wikiFilename: "Enemy_The_Game_Before_the_Gate.png" },
  { name: "The Doctor - Dottore", category: "Weekly Boss", region: "Nod-Krai", wikiFilename: "Enemy_The_Doctor_-_Dottore.png" },
  { name: "Exalted Master of the Heretical Path", category: "Weekly Boss", region: "Nod-Krai", wikiFilename: "Enemy_Exalted_Master_of_the_Heretical_Path.png" }
];

export const localLegends: Boss[] = [
  { name: "Maha Vasudevayaputra", category: "Local Legend", region: "Mondstadt" },
  { name: "Churldric", category: "Local Legend", region: "Mondstadt" },
  { name: "Raskolnikov", category: "Local Legend", region: "Nod-Krai" },
  { name: "Crab Tsar", category: "Local Legend", region: "Nod-Krai" },
  { name: "Sigurd", category: "Local Legend", region: "Nod-Krai" },
  { name: "Hiljetta", category: "Local Legend", region: "Nod-Krai" },
  { name: "Hexadecatonic Mandragora", category: "Local Legend", region: "Nod-Krai" },
  { name: "Homesick Lone Wolf", category: "Local Legend", region: "Nod-Krai" },
  { name: "Mushteshir", category: "Local Legend", region: "Nod-Krai" },
  { name: "Prism Slime", category: "Local Legend", region: "Nod-Krai" },
  { name: "Atlatl's Blessing", category: "Local Legend", region: "Natlan" },
  { name: "Balachko", category: "Local Legend", region: "Natlan" },
  { name: "Bronzelock", category: "Local Legend", region: "Natlan" },
  { name: "Chimalli's Shade", category: "Local Legend", region: "Natlan" },
  { name: "Cihuacoatl of Chimeric Bone", category: "Local Legend", region: "Natlan" },
  { name: "Cocijo", category: "Local Legend", region: "Natlan" },
  { name: "He Never Dies", category: "Local Legend", region: "Natlan" },
  { name: "Ichcahuipilli's Aegis", category: "Local Legend", region: "Natlan" },
  { name: "Ironbeard", category: "Local Legend", region: "Natlan" },
  { name: "Polychrome Tri-Stars", category: "Local Legend", region: "Natlan" },
  { name: "Potapo's Solidarity", category: "Local Legend", region: "Natlan" },
  { name: "Rilai", category: "Local Legend", region: "Natlan" },
  { name: "Sappho Amidst The Waves", category: "Local Legend", region: "Natlan" },
  { name: "Spirit of the Fallen Dawnstar", category: "Local Legend", region: "Natlan" },
  { name: "Tlatzacuilotl", category: "Local Legend", region: "Natlan" },
  { name: "Tupayo's Aid", category: "Local Legend", region: "Natlan" },
  { name: "Tupu's Lushness", category: "Local Legend", region: "Natlan" },
  { name: "Reji", category: "Local Legend", region: "Natlan" },
  { name: "Ironclaw and Battlegoat", category: "Local Legend", region: "Natlan" },
  { name: "The Peak", category: "Local Legend", region: "Natlan" },
  { name: "Infinitesimal", category: "Local Legend", region: "Natlan" },
  { name: "The Last Survivor of Tenochtzitoc", category: "Local Legend", region: "Natlan" },
  { name: "Iron Viscount", category: "Local Legend", region: "Fontaine" },
  { name: "Vivianne of the Lake", category: "Local Legend", region: "Fontaine" },
  { name: "Ninianne of the Lake", category: "Local Legend", region: "Fontaine" },
  { name: "Dobharcu, Lord of the Hidden", category: "Local Legend", region: "Fontaine" },
  { name: "Swords of the Gorge", category: "Local Legend", region: "Fontaine" },
  { name: "Ocean Circuit Judge", category: "Local Legend", region: "Fontaine" },
  { name: "Fading Veteran", category: "Local Legend", region: "Fontaine" },
  { name: "Yseut", category: "Local Legend", region: "Fontaine" },
  { name: "Luachra, the Brilliant", category: "Local Legend", region: "Fontaine" },
  { name: "Automated Supercomputing Field Generator", category: "Local Legend", region: "Fontaine" },
  { name: "Liam", category: "Local Legend", region: "Fontaine" },
  { name: "Rocky Avildsen", category: "Local Legend", region: "Fontaine" },
  { name: "Deianeira of Snezhevna", category: "Local Legend", region: "Fontaine" },
  { name: "Cineas", category: "Local Legend", region: "Fontaine" },
  { name: "Ruler of the Chizhang Mountains", category: "Local Legend", region: "Liyue" }
];

export const bossesData: Boss[] = [...worldBosses, ...weeklyBosses, ...localLegends];

export function getBossImageUrl(boss: Boss, type: "icon" | "portrait" = "icon"): string {
  if (boss.apiId) {
    return `https://genshin.jmp.blue/boss/weekly-boss/${boss.apiId}/${type}`;
  }
  const filename = boss.wikiFilename || `Enemy_${boss.name.replace(/ /g, "_").replace(/:/g, "").replace(/'/g, "%27")}.png`;
  return `https://genshin-impact.fandom.com/wiki/Special:FilePath/${filename}`;
}

export function getRegionElement(region: string): "Anemo" | "Geo" | "Electro" | "Dendro" | "Hydro" | "Pyro" | "Cryo" | "None" {
  switch (region) {
    case "Mondstadt": return "Anemo";
    case "Liyue": return "Geo";
    case "Inazuma": return "Electro";
    case "Sumeru": return "Dendro";
    case "Fontaine": return "Hydro";
    case "Natlan": return "Pyro";
    case "Snezhnaya": return "Cryo";
    default: return "None";
  }
}
