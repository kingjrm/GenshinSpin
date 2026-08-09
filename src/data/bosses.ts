export interface Boss {
  name: string;
  category: "World Boss" | "Weekly Boss";
  element: "Anemo" | "Geo" | "Electro" | "Dendro" | "Hydro" | "Pyro" | "Cryo" | "None";
  apiId?: string;
  wikiFilename?: string;
}

export const worldBosses: Boss[] = [
  { name: "Anemo Hypostasis", category: "World Boss", element: "Anemo", wikiFilename: "Enemy_Anemo_Hypostasis.png" },
  { name: "Cryo Hypostasis", category: "World Boss", element: "Cryo", wikiFilename: "Enemy_Cryo_Hypostasis.png" },
  { name: "Cryo Regisvine", category: "World Boss", element: "Cryo", wikiFilename: "Enemy_Cryo_Regisvine.png" },
  { name: "Electro Hypostasis", category: "World Boss", element: "Electro", wikiFilename: "Enemy_Electro_Hypostasis.png" },
  { name: "Watcher - Fallen Vigil", category: "World Boss", element: "None", wikiFilename: "Enemy_Watcher_-_Fallen_Vigil.png" },
  { name: "Geo Hypostasis", category: "World Boss", element: "Geo", wikiFilename: "Enemy_Geo_Hypostasis.png" },
  { name: "Oceanid", category: "World Boss", element: "Hydro", wikiFilename: "Enemy_Oceanid.png" },
  { name: "Primo Geovishap", category: "World Boss", element: "Geo", wikiFilename: "Enemy_Primo_Geovishap.png" },
  { name: "Pyro Regisvine", category: "World Boss", element: "Pyro", wikiFilename: "Enemy_Pyro_Regisvine.png" },
  { name: "Ruin Serpent", category: "World Boss", element: "Geo", wikiFilename: "Enemy_Ruin_Serpent.png" },
  { name: "Solitary Suanni", category: "World Boss", element: "Anemo", wikiFilename: "Enemy_Solitary_Suanni.png" },
  { name: "Bathysmal Vishap Herd", category: "World Boss", element: "Cryo", wikiFilename: "Enemy_Coral_Defenders.png" },
  { name: "Golden Wolflord", category: "World Boss", element: "Geo", wikiFilename: "Enemy_Golden_Wolflord.png" },
  { name: "Hydro Hypostasis", category: "World Boss", element: "Hydro", wikiFilename: "Enemy_Hydro_Hypostasis.png" },
  { name: "Maguu Kenki", category: "World Boss", element: "Anemo", wikiFilename: "Enemy_Maguu_Kenki.png" },
  { name: "Perpetual Mechanical Array", category: "World Boss", element: "None", wikiFilename: "Enemy_Perpetual_Mechanical_Array.png" },
  { name: "Pyro Hypostasis", category: "World Boss", element: "Pyro", wikiFilename: "Enemy_Pyro_Hypostasis.png" },
  { name: "Thunder Manifestation", category: "World Boss", element: "Electro", wikiFilename: "Enemy_Thunder_Manifestation.png" },
  { name: "Jadeplume Terrorshroom", category: "World Boss", element: "Dendro", wikiFilename: "Enemy_Jadeplume_Terrorshroom.png" },
  { name: "Electro Regisvine", category: "World Boss", element: "Electro", wikiFilename: "Enemy_Electro_Regisvine.png" },
  { name: "Aeonblight Drake", category: "World Boss", element: "None", wikiFilename: "Enemy_Aeonblight_Drake.png" },
  { name: "Algorithm of Semi-Intransient Matrix of Overseer Network", category: "World Boss", element: "None", wikiFilename: "Enemy_Algorithm_of_Semi-Intransient_Matrix_of_Overseer_Network.png" },
  { name: "Dendro Hypostasis", category: "World Boss", element: "Dendro", wikiFilename: "Enemy_Dendro_Hypostasis.png" },
  { name: "Setekh Wenut", category: "World Boss", element: "Anemo", wikiFilename: "Enemy_Setekh_Wenut.png" },
  { name: "Iniquitous Baptist", category: "World Boss", element: "None", wikiFilename: "Enemy_Iniquitous_Baptist.png" },
  { name: "Icewind Suite", category: "World Boss", element: "Anemo", wikiFilename: "Enemy_Icewind_Suite_-_Dirge_of_Coppelia.png" },
  { name: "Emperor of Fire and Iron", category: "World Boss", element: "Pyro", wikiFilename: "Enemy_Emperor_of_Fire_and_Iron.png" },
  { name: "Experimental Field Generator", category: "World Boss", element: "Geo", wikiFilename: "Enemy_Experimental_Field_Generator.png" },
  { name: "Millennial Pearl Seahorse", category: "World Boss", element: "Electro", wikiFilename: "Enemy_Millennial_Pearl_Seahorse.png" },
  { name: "Hydro Tulpa", category: "World Boss", element: "Hydro", wikiFilename: "Enemy_Hydro_Tulpa.png" },
  { name: "Legatus Golem", category: "World Boss", element: "Geo", wikiFilename: "Enemy_Legatus_Golem.png" },
  { name: "Goldflame Qucusaur Tyrant", category: "World Boss", element: "Pyro", wikiFilename: "Enemy_Goldflame_Qucusaur_Tyrant.png" },
  { name: "Gluttonous Yumkasaur Mountain King", category: "World Boss", element: "Dendro", wikiFilename: "Enemy_Gluttonous_Yumkasaur_Mountain_King.png" },
  { name: "Secret Source Automaton - Configuration Device", category: "World Boss", element: "None", wikiFilename: "Enemy_Secret_Source_Automaton_-_Configuration_Device.png" },
  { name: "Tenebrous Papilla", category: "World Boss", element: "None", wikiFilename: "Enemy_Tenebrous_Papilla.png" },
  { name: "Wayward Hermetic Spiritspeaker", category: "World Boss", element: "None", wikiFilename: "Enemy_Wayward_Hermetic_Spiritspeaker.png" },
  { name: "Lava Dragon Statue", category: "World Boss", element: "Pyro", wikiFilename: "Enemy_Lava_Dragon_Statue.png" },
  { name: "Secret Source Automaton: Overseer Device", category: "World Boss", element: "None", wikiFilename: "Enemy_Secret_Source_Automaton_Overseer_Device.png" },
  { name: "Radiant Moonfly", category: "World Boss", element: "None", wikiFilename: "Enemy_Radiant_Moonfly.png" },
  { name: "Knuckle Duckle", category: "World Boss", element: "None", wikiFilename: "Enemy_Knuckle_Duckle.png" },
  { name: "Frostnight Herra", category: "World Boss", element: "Cryo", wikiFilename: "Enemy_Frostnight_Herra.png" },
  { name: "Super-Heavy Landrover: Mechanized Fortress", category: "World Boss", element: "None", wikiFilename: "Enemy_Super-Heavy_Landrover_Mechanized_Fortress.png" },
  { name: "Lord of the Hidden Depths - Whisperer of Nightmares", category: "World Boss", element: "None", wikiFilename: "Enemy_Lord_of_the_Hidden_Depths_-_Whisperer_of_Nightmares.png" },
  { name: "Radiant Moongecko", category: "World Boss", element: "None", wikiFilename: "Enemy_Radiant_Moongecko.png" },
  { name: "Chimeric Winged Lion", category: "World Boss", element: "None", wikiFilename: "Enemy_Chimeric_Winged_Lion.png" },
  { name: "Immortal Construct", category: "World Boss", element: "None", wikiFilename: "Enemy_Immortal_Construct.png" }
];

export const weeklyBosses: Boss[] = [
  { name: "Stormterror Dvalin", category: "Weekly Boss", element: "Anemo", apiId: "stormterror" },
  { name: "Lupus Boreas", category: "Weekly Boss", element: "Cryo", apiId: "lupus-boreas" },
  { name: "Childe", category: "Weekly Boss", element: "Hydro", apiId: "childe" },
  { name: "Azhdaha", category: "Weekly Boss", element: "Geo", apiId: "azhdaha" },
  { name: "La Signora", category: "Weekly Boss", element: "Cryo", apiId: "la-signora" },
  { name: "Raiden Shogun", category: "Weekly Boss", element: "Electro", apiId: "magatsu-mitake-narukami-no-mikoto" },
  { name: "Scaramouche Boss", category: "Weekly Boss", element: "Electro", apiId: "everlasting-lord-of-arcane-wisdom" },
  { name: "Guardian of Apep's Oasis", category: "Weekly Boss", element: "Dendro", apiId: "guardian-of-apep-s-oasis" },
  { name: "All-Devouring Narwhal", category: "Weekly Boss", element: "Hydro", apiId: "all-devouring-narwhal" },
  { name: "The Knave - Arlecchino", category: "Weekly Boss", element: "Pyro", apiId: "the-knave" },
  { name: "Lord of Eroded Primal Fire", category: "Weekly Boss", element: "Pyro", wikiFilename: "Enemy_Lord_of_Eroded_Primal_Fire.png" },
  { name: "The Game Before the Gate", category: "Weekly Boss", element: "None", wikiFilename: "Enemy_The_Game_Before_the_Gate.png" },
  { name: "The Doctor - Dottore", category: "Weekly Boss", element: "None", wikiFilename: "Enemy_The_Doctor_-_Dottore.png" },
  { name: "Exalted Master of the Heretical Path", category: "Weekly Boss", element: "None", wikiFilename: "Enemy_Exalted_Master_of_the_Heretical_Path.png" }
];

export const bossesData: Boss[] = [...worldBosses, ...weeklyBosses];

export function getBossImageUrl(boss: Boss, type: "icon" | "portrait" = "icon"): string {
  if (boss.apiId) {
    return `https://genshin.jmp.blue/boss/weekly-boss/${boss.apiId}/${type}`;
  }
  const filename = boss.wikiFilename || `Enemy_${boss.name.replace(/ /g, "_").replace(/:/g, "")}.png`;
  return `https://genshin-impact.fandom.com/wiki/Special:FilePath/${filename}`;
}
