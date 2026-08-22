// DREAM02 · shared mood scoring — used by index.html (image selection) AND photolab.html
// (the mood categorization grid). One copy so the dream and the editor never drift apart.
//
// Photo Lab "related words" → (valence, arousal).
// valence: -1 BAD .. +1 GOOD   ·   arousal: -1 PEACEFUL .. +1 CHAOTIC.
// Hand-tuned from Mattia's actual tags (incl. his spellings: anxiaety/peacful/chatoic/…).
// Edit any pair to retune; unknown words simply contribute nothing (image stays neutral).
const MOOD_LEX = {
 // ---- good / peaceful ----
 'relaxed':[.6,-.7],'relaxded':[.6,-.7],'relax':[.7,-.7],'relaxing':[.7,-.7],
 'calm':[.7,-.8],'calmness':[.7,-.8],'peace':[.85,-.9],'peaceful':[.8,-.9],'peacful':[.8,-.9],
 'zen':[.8,-.85],'meditation':[.7,-.8],'meditative':[.7,-.8],'sleeping':[.3,-.6],'surrender':[.3,-.45],
 'content':[.6,-.5],'care':[.6,-.2],'warm':[.6,-.35],'home':[.5,-.4],'summer':[.5,-.2],'afternoon':[.35,-.4],
 'nature':[.45,-.5],'landscape':[.35,-.5],'forest':[.35,-.35],'trees':[.3,-.35],'mountains':[.4,-.45],
 'mouintains':[.4,-.45],'ocean':[.4,-.45],'sea':[.4,-.4],'lake':[.4,-.45],'water':[.35,-.4],'waves':[.3,-.3],
 'sky':[.4,-.4],'clouds':[.15,-.4],'cloud':[.15,-.4],'sun':[.5,-.2],'light':[.5,-.1],'blue':[.2,-.35],
 'green':[.35,-.35],'organic':[.35,-.35],'vines':[.2,-.1],'dreamy':[.4,-.4],'dream':[.3,-.15],
 'connected':[.6,-.35],'connection':[.6,-.3],'connect':[.6,-.3],'interconnected':[.6,-.3],
 'understanding':[.5,-.3],'knowledge':[.4,-.2],'structure':[.3,-.4],'order':[.3,-.5],'pattern':[.2,-.3],
 'happy':[.9,.15],'love':[.85,.1],'beautiful':[.7,.0],'friends':[.7,.0],'freedom':[.7,.1],'intimacy':[.6,-.1],
 'angel':[.6,-.2],'mother':[.5,-.2],'protect':[.3,.1],'kid':[.25,.0],'child':[.25,.0],
 'wonder':[.45,.05],'curiosity':[.4,.15],'curious':[.4,.15],'creativity':[.5,.25],'creation':[.5,.2],
 'magic':[.4,.25],'magician':[.3,.25],'mystery':[.2,.25],'mistery':[.2,.25],'misterious':[.2,.25],
 'sensual':[.4,.35],'sex':[.3,.4],'pink':[.35,.05],'purple':[.25,.0],'funny':[.6,.2],'funky':[.4,.2],
 'colours':[.4,.2],'colour':[.35,.15],'colourful':[.4,.2],'colourfull':[.4,.2],'restart':[.3,.1],
 // ---- bad / chaotic ----
 'scared':[-.7,.55],'anxiety':[-.8,.55],'anxiaety':[-.8,.55],'anxious':[-.7,.5],'stress':[-.6,.5],
 'fear':[-.7,.55],'insecure':[-.5,.25],'insecurity':[-.5,.25],'trauma':[-.7,.4],'hate':[-.7,.5],
 'violence':[-.8,.8],'violent':[-.8,.8],'violently':[-.8,.8],'fight':[-.5,.7],'fighter':[-.35,.55],
 'attack':[-.6,.6],'sword':[-.3,.5],'kill':[-.8,.7],'anger':[-.6,.75],'madness':[-.6,.85],
 'screaming':[-.7,.8],'scream':[-.7,.8],'voices':[-.5,.6],'chaos':[-.35,.9],'chaotic':[-.35,.9],
 'chatoic':[-.35,.9],'destruction':[-.6,.55],'deconstruction':[-.3,.4],'explosion':[-.4,.8],
 'demon':[-.8,.6],'demons':[-.8,.6],'demonic':[-.8,.6],'underworld':[-.4,.3],'burning':[-.4,.55],
 'fire':[-.2,.55],'fever':[-.4,.6],'dark':[-.5,.15],'darkness':[-.6,.2],'death':[-.6,.25],'dead':[-.6,.15],
 'pain':[-.75,.45],'trapped':[-.7,.35],'stuck':[-.5,.3],'claustrophobia':[-.7,.5],'claustrophobic':[-.7,.5],
 'falling':[-.5,.4],'losing':[-.5,.3],'loss':[-.55,.1],'pit':[-.5,.2],'nowhere':[-.3,-.1],
 'depersonalization':[-.6,.4],'derealization':[-.6,.4],'scattered':[-.3,.5],'controlled':[-.4,.35],
 'control':[-.3,.35],'defigured':[-.6,.5],'disfigured':[-.6,.5],'ugly':[-.4,.2],
 'sad':[-.5,-.1],'sadness':[-.5,-.1],'somber':[-.35,-.2],'depression':[-.7,-.15],'depressed':[-.7,-.15],
 'loneliness':[-.5,-.1],'lonely':[-.5,-.1],'alone':[-.4,-.1],'bored':[-.2,-.5],
 // ---- mildly charged / colour + motion ----
 'red':[-.1,.35],'neon':[.2,.3],'cyber':[.0,.3],'city':[.0,.3],'mischief':[.2,.4],'wind':[.1,-.15],
 'rain':[-.05,.1],'night':[-.1,-.15],
};
// score one image's word string → mood point in (char,chaos) space, or the neutral centre.
// {cx: 0 good..1 bad, cy: 0 peaceful..1 chaotic, conf: how many words matched (0 = neutral pool)}.
function scoreWords(words) {
  if (!words) return { cx: .5, cy: .5, conf: 0 };
  let v = 0, a = 0, n = 0;
  words.toLowerCase().split(/[,;]/).forEach(piece => piece.split(/\s+/).forEach(w => {
    w = w.replace(/[^a-z]/g, '');
    const m = MOOD_LEX[w];
    if (m) { v += m[0]; a += m[1]; n++; }
  }));
  if (!n) return { cx: .5, cy: .5, conf: 0 };
  v /= n; a /= n;
  return { cx: (1 - v) / 2, cy: (a + 1) / 2, conf: n };   // valence→char (good=0/bad=1), arousal→chaos (peace=0/chaos=1)
}
