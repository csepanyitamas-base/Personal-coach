const QUOTES = [
  'A mai edzés a holnapi erőd.',
  'Nem kell tökéletesnek lenned, csak el kell kezdened.',
  'Minden ismétlés közelebb visz a célodhoz.',
  'A fejlődés lassú, de a feladás végleges.',
  'Nem versenyzel senkivel, csak a tegnapi éneddel.',
  'A kényelmes zóna szép hely, de ott semmi sem nő.',
  'Kis lépések is előrevisznek – csak mozdulj meg.',
  'A testeddel most fektetsz be a jövődbe.',
  'Az izzadság a zsír könnyei.',
  'Ma megteszed, amit sokan halogatnak.',
  'A motiváció elindít, a szokás célba visz.',
  'Nincs rossz edzés, csak elmaradt edzés.',
  'Légy büszke minden apró győzelemre.',
  'A tested mindenre képes – a fejed meg kell győznöd.',
  'Egy edzés nem változtat semmit, de a sokadik igen.',
]

const STREAK_MESSAGES: Record<number, string> = {
  1: 'Szép munka! Az első lépés a legfontosabb.',
  3: '3 napos sorozat! Kezd összeállni a rutin.',
  7: 'Egy teljes hét! Igazi szokást építesz.',
  14: '2 hét kitartás – ez már nem véletlen, ez elköteleződés!',
  30: '30 napos sorozat! Elképesztő fegyelem.',
  60: '60 nap! Ez már életmód, nem kihívás.',
  100: '100 nap! Legendás kitartás.',
}

export function getDailyQuote(seed?: number): string {
  const s = seed ?? Math.floor(Date.now() / (1000 * 60 * 60 * 24))
  return QUOTES[s % QUOTES.length]
}

export function getStreakMessage(streak: number): string | null {
  return STREAK_MESSAGES[streak] ?? null
}

export function getEncouragementForMissedDay(): string {
  const options = [
    'Kihagytál egy napot, de ez nem a vége! Folytassuk ma.',
    'Mindenkivel előfordul. A fontos, hogy visszatérj.',
    'Egy kihagyott edzés nem törli a korábbi eredményeidet. Gyerünk tovább!',
  ]
  return options[Math.floor(Math.random() * options.length)]
}
