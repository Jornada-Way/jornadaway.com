// Jornada Enneagram assessment: question bank, scoring weights and results library.
// Source: "Enneagram Test with subtypes (first draft)".
window.JORNADA_ENNEAGRAM = {
  instincts: {
    SP: { name: "Self-Preservation", short: "SP", focus: "security, comfort, health and resources" },
    SO: { name: "Social", short: "SO", focus: "belonging, standing and contribution to the group" },
    SX: { name: "One-to-One", short: "SX", focus: "intensity, chemistry and deep singular connection" }
  },

  types: {
    1: { name: "The Reformer", center: "Gut", motive: "I want to be good, right and above reproach." },
    2: { name: "The Helper", center: "Heart", motive: "I want to be loved and needed by others." },
    3: { name: "The Achiever", center: "Heart", motive: "I want to be valued for what I accomplish." },
    4: { name: "The Individualist", center: "Heart", motive: "I want to find and express my true, unique self." },
    5: { name: "The Investigator", center: "Head", motive: "I want to understand and to feel competent and self-sufficient." },
    6: { name: "The Loyalist", center: "Head", motive: "I want to feel safe, supported and prepared." },
    7: { name: "The Enthusiast", center: "Head", motive: "I want to stay free, satisfied and open to possibility." },
    8: { name: "The Challenger", center: "Gut", motive: "I want to be strong and in control of my own life." },
    9: { name: "The Peacemaker", center: "Gut", motive: "I want inner peace and harmony around me." }
  },

  centers: {
    Gut: { label: "The Gut Center (8, 9, 1)", focus: "Doing and instinct", work: "Learn to pause before acting. Connect with your emotions and thoughts so your actions are not just reactions." },
    Heart: { label: "The Heart Center (2, 3, 4)", focus: "Feeling and connection", work: "Learn to find your value internally. Practice being seen without needing to perform, help or be unique." },
    Head: { label: "The Head Center (5, 6, 7)", focus: "Thinking and security", work: "Learn to trust your body. Move from analyzing life to experiencing it in the present moment." }
  },

  // Each answer is 1 (Strongly Disagree) to 5 (Strongly Agree), normalized to 0..1, then multiplied by its weights.
  questions: [
    { t: "I am often the first to notice if a room is too cold, if I'm hungry, or if a budget is off-track.", w: { SP: 1 } },
    { t: "I feel a constant internal critic urging me to improve things and do what is right.", w: { T1: 1 } },
    { t: "I am very tuned into others' needs and feel best when I am being helpful or indispensable.", w: { T2: 1 } },
    { t: "I find myself tracking who is \"in\" and who is \"out\" in any group or social setting.", w: { SO: 1 } },
    { t: "I prefer to observe and gather information from a distance rather than jumping into emotional or social situations.", w: { T5: 1 } },
    { t: "I am highly driven by goals, efficiency and being seen as successful in what I do.", w: { T3: 1 } },
    { t: "I am drawn to intense, one-on-one spark or chemistry rather than general group harmony.", w: { SX: 1 } },
    { t: "I value being strong and independent. I dislike it when others try to control or manipulate me.", w: { T8: 1 } },
    { t: "I feel a sense of longing for something more and often feel fundamentally different from others.", w: { T4: 1 } },
    { t: "I prioritize creating a stable and cozy home environment.", w: { SP: 1, T6: 0.5, T9: 0.3 } },
    { t: "I am constantly scanning for potential risks and I value loyalty and reliable support systems.", w: { T6: 1 } },
    { t: "I prioritize inner peace and outer harmony, often going along with others to avoid conflict.", w: { T9: 1 } },
    { t: "Maintaining my physical health and a sense of home is my primary daily focus.", w: { SP: 1 } },
    { t: "I am always looking for the next exciting possibility or adventure so I don't feel trapped or bored.", w: { T7: 1 } },
    { t: "I feel resentment when others don't follow the rules or standards I hold myself to.", w: { T1: 1 } },
    { t: "I feel a strong responsibility to contribute to my community or professional circle.", w: { SO: 1 } },
    { t: "I find it very hard to ask for help, even when I am exhausted from helping others.", w: { T2: 1 } },
    { t: "I feel depleted after too much social interaction and need long periods of solitude to recharge.", w: { T5: 1 } },
    { t: "I have an all-or-nothing energy when I am interested in someone or a new project.", w: { SX: 1 } },
    { t: "I would rather be respected for my strength than liked for my kindness.", w: { T8: 1 } },
    { t: "I am constantly adjusting my persona to match the expectations of the room I am in.", w: { T3: 1 } },
    { t: "I am a worst-case scenario thinker. I like to have a backup plan for my backup plan.", w: { T6: 1 } },
    { t: "People often think I'm tough or sunny because I keep my deepest pains to myself.", w: { T4: 1, SP: 1 } },
    { t: "I often feel like my own opinions or needs don't matter as much as keeping things calm.", w: { T9: 1 } },
    { t: "I prefer clear boundaries around my time, energy and resources.", w: { SP: 1 } },
    { t: "I have a fear of missing out that makes it hard for me to commit to just one path.", w: { T7: 1 } },
    { t: "I feel a strange sense of comfort in my melancholy or deep emotions.", w: { T4: 1 } },
    { t: "I care deeply about how I am perceived by the collective or my peers.", w: { SO: 1 } },
    { t: "I often feel like I am the only adult in the room who is being responsible.", w: { T1: 1 } },
    { t: "I feel a deep need to be chosen or specially recognized by one person.", w: { SX: 1, T4: 0.4, T2: 0.4 } },
    { t: "I prefer to have a niche, a specific area of expertise where I feel fully competent.", w: { T5: 1 } },
    { t: "I find it difficult to slow down and just be, without a goal or a project.", w: { T3: 1 } },
    { t: "I am very quick to detect when someone is being fake or trying to play me.", w: { T8: 1 } },
    { t: "I often sacrifice my own fun or desires to serve a greater cause or help the group.", w: { T7: 1, SO: 1 } },
    { t: "I am often looking for the missing piece, a deep soul connection, in my interactions.", w: { SX: 1 } },
    { t: "I feel a sense of pride in knowing that people depend on me.", w: { T2: 1 } },
    { t: "I am deeply loyal to my inner circle and feel unsettled by sudden changes in leadership or rules.", w: { T6: 1 } },
    { t: "I tend to zone out or distract myself with easy tasks when life gets too demanding.", w: { T9: 1 } },
    { t: "I am more concerned with my private inner sanctum than with my social status.", w: { SP: 1 } },
    { t: "I am often searching for a way to express the real me that others don't seem to see.", w: { T4: 1 } },
    { t: "I am very good at reframing negative situations into something positive or an opportunity.", w: { T7: 1 } },
    { t: "I feel a passionate, almost fiery need to reform the people I am closest to.", w: { T1: 1, SX: 1 } },
    { t: "I naturally track the hierarchy or social order in any new group.", w: { SO: 1 } },
    { t: "I often suppress my own emotional pain to get the job done.", w: { T4: 0.8, SP: 1 } },
    { t: "I try to be as warm and disarming as possible so people won't see me as a threat.", w: { T6: 1, SP: 1 } },
    { t: "I feel a physical rush or buzz when I am in a high-intensity one-on-one conversation.", w: { SX: 1 } },
    { t: "I feel a strong urge to protect those who are being treated unfairly.", w: { T8: 0.9, SO: 1 } },
    { t: "I am a workaholic for the groups I belong to, even if I'm easygoing about my own goals.", w: { T9: 1, SO: 1 } }
  ],

  subtypes: {
    "sp-1": { title: "The Worrywart", key: "Worry", text: "You focus your perfectionism inward. You are often anxious about doing things right and can be your own harshest critic. You seek security through being beyond reproach.", growth: "Practice radical acceptance. Schedule time where nothing has to be improved or fixed.", daily: "Today, identify one imperfection in your environment and intentionally leave it alone. Notice the anxiety that arises and breathe through it without fixing." },
    "so-1": { title: "The Teacher", key: "Non-Adaptability", text: "You focus on the right way for everyone. You are high-minded and principled, often acting as a role model or advocate for social standards and ethics.", growth: "Notice when \"should\" becomes a weapon. Practice listening without the intent to correct.", daily: "When you feel the urge to correct someone today, ask yourself: is this a moral necessity, or am I just attached to my way? Try listening instead." },
    "sx-1": { title: "Zeal", key: "Zeal", text: "You are the most intense 1. You focus on perfecting others, especially partners. You have a fiery, reformist energy and aren't afraid to demand change in those you love.", growth: "Turn your high standards into self-compassion. Allow your partner to be imperfectly human.", daily: "Focus on one thing you appreciate about your partner or closest friend today that has nothing to do with their improvement or potential." },

    "sp-2": { title: "Privilege", key: "Privilege", text: "You are the youthful 2. You act charming or endearing so that others will want to take care of you. You seek protection by being indispensable and lovable.", growth: "Acknowledge your own needs directly. You don't have to be cute or helpless to be cared for.", daily: "Ask for something you need directly today without using charm or hinting. Notice how it feels to be a person with legitimate needs." },
    "so-2": { title: "Ambition", key: "Ambition", text: "You are a power 2. You help on a large scale: groups, organizations and circles. You want to be a person of influence who is loved by the collective.", growth: "Check your motives for service. Are you helping to give, or to gain influence?", daily: "Identify a group you serve. Today, step back and let someone else take the lead. Observe your need to be the indispensable one." },
    "sx-2": { title: "Seduction", key: "Seduction", text: "You focus your energy on one specific person at a time. You are highly attractive and attentive, seeking to become the most important person in your partner's life.", growth: "Find your center outside of others. Cultivate a hobby or interest that is yours alone.", daily: "Spend thirty minutes in total solitude today. Practice being with yourself without wondering how you are being perceived by your special person." },

    "sp-3": { title: "Security", key: "Security", counter: true, text: "You work incredibly hard but don't like to show off. You want to actually be successful and secure rather than just look the part.", growth: "Slow down. Your value is not tied to your productivity or the stability of your bank account.", daily: "Perform a task today and keep the result entirely to yourself. Do not post it, share it or mention it. Notice if the work feels less than without an audience." },
    "so-3": { title: "Prestige", key: "Prestige", text: "You are the classic 3. You are highly attuned to social status and winning in the eyes of your peers. You are a master of branding and presentation.", growth: "Take off the mask. Share a failure or a struggle with a trusted friend to build real connection.", daily: "Notice a moment today where you are shaping your story to look better. Stop mid-sentence and share the plain, unvarnished truth instead." },
    "sx-3": { title: "Charisma", key: "Charisma", text: "You focus your ambition on supporting others or being the ideal partner. You use your drive to be the most desirable or supportive person in a one-on-one dynamic.", growth: "Support yourself as much as you support others. Your own dreams are just as valid as your partner's.", daily: "Ask yourself: what do I want today that has nothing to do with my partner's success? Take one small action toward that personal desire." },

    "sp-4": { title: "Tenacity", key: "Dauntless", counter: true, text: "You are the long-suffering 4. You don't complain. You develop high endurance and toughness to deal with your inner pain, and you often look like a 1 or a 3.", growth: "Let yourself be seen in your struggle. High endurance is a gift, but sharing your pain is a healing.", daily: "When you feel a struggle today, share it with one trusted person. Practice the softness of being supported rather than the strength of suffering alone." },
    "so-4": { title: "Shame", key: "Shame", text: "You feel your otherness most in groups. You are emotionally honest and vulnerable, often seeking a place where your unique sensitivity is finally understood.", growth: "Look for commonalities. Instead of focusing on why you don't fit in, look for how you belong.", daily: "Look for three things you have in common with a stranger today. Consciously push against the story that you are fundamentally different." },
    "sx-4": { title: "Competition", key: "Competition", text: "You project your inner sense of lack outward as a demand for respect. You can be competitive and intense, using your uniqueness as a shield or a weapon.", growth: "Transform envy into creativity. Use your intense energy to build something rather than to compete.", daily: "When you feel envy today, use it as a signal for your own creativity. Ask: what is this person doing that I am afraid to start for myself? Then start it." },

    "sp-5": { title: "The Castle", key: "Castle", text: "You are the most private 5. You focus on minimizing needs and protecting your home and resources. You need a lot of physical space to feel safe.", growth: "Open the doors to your castle. Let people in before you feel fully prepared to host them.", daily: "Start one social interaction today that isn't strictly necessary. Notice how much energy it actually takes versus how much you thought it would take." },
    "so-5": { title: "Totem", key: "Totem", text: "You seek super-knowledge. You want to belong to a group of experts or share high-level ideas. You are the most social of the 5s, as long as the topic is intellectual.", growth: "Connect the head to the heart. Use your vast knowledge to build emotional bonds, not just intellectual ones.", daily: "Share a feeling today instead of a fact. When someone asks how you are, skip the data and report on your inner state." },
    "sx-5": { title: "Confidant", key: "Confidant", text: "You look for one person to share your secret inner world with. You are searching for a soul union that bypasses the need for shallow social interaction.", growth: "Trust the one-on-one connection. You don't need to hold back your mystery to be safe.", daily: "Practice transparency with your close person. Share a thought you usually keep hidden in your inner sanctum and experience the safety of being known." },

    "sp-6": { title: "Warmth", key: "Warmth", text: "You seek safety by being likable. You are disarming, friendly and warm so that others won't attack or abandon you.", growth: "Trust your own inner authority. You have the skills to survive even without a perfect safety net.", daily: "Choose a decision you've been putting off. Make it today without asking for anyone's opinion. Trust your own inner pilot." },
    "so-6": { title: "Duty", key: "Duty", text: "You look for safety in the law or a clear system. You are highly loyal to a cause, a book or a leader that provides clear rules to follow.", growth: "Question the rules. Learn to navigate the gray areas of life where there is no clear manual.", daily: "Question one rule or standard procedure you follow. Ask: does this serve me now, or am I just following the script for safety?" },
    "sx-6": { title: "Strength and Beauty", key: "Strength", counter: true, text: "Instead of hiding, you run toward your fears. You develop strength or an intimidating presence to make sure no one messes with you.", growth: "Lean into your soft side. True courage is being afraid and acting anyway, without the tough persona.", daily: "Admit a fear today without masking it with a joke or a tough stance. Notice that your vulnerability doesn't actually make you less safe." },

    "sp-7": { title: "Keepers of the Nest", key: "Keepers of the Nest", text: "You are practical and network-oriented. You make sure you and your friends have everything you need for a good time. You are the gourmet 7.", growth: "Practice moderation. Real satisfaction comes from depth and presence, not from having enough options.", daily: "Sit with one boring task today for 20 minutes without reaching for your phone or a snack. Practice finding the depth in the mundane." },
    "so-7": { title: "Sacrifice", key: "Sacrifice", counter: true, text: "You set aside your own appetite for fun to serve a higher ideal or help the group. You are often mistaken for a Type 2 or a Type 1.", growth: "It's okay to be selfish sometimes. You don't have to save the world to justify your joy.", daily: "Do something purely for your own pleasure today that serves no higher purpose or community goal. Enjoy it without guilt." },
    "sx-7": { title: "Fascination", key: "Fascination", text: "You live in a world of imagination and spark. You are looking for a magical connection or an ideal future that is better than ordinary reality.", growth: "Ground yourself in the present. The magical future is built by doing the work in the ordinary now.", daily: "Stay present in a conversation today even when it turns to a difficult or heavy topic. Resist the urge to reframe it into something positive." },

    "sp-8": { title: "Satisfaction", key: "Satisfaction", text: "You are the quiet 8. You focus on getting what you need, from money to food to power, without making a big scene. You are highly protective and territorial.", growth: "Practice vulnerability in small steps. Real strength includes the ability to ask for help.", daily: "When you feel a need today, wait 10 minutes before fulfilling it. Notice the difference between a survival impulse and a conscious choice." },
    "so-8": { title: "Solidarity", key: "Solidarity", text: "You are the protector. You use your power to defend your friends, family or the underdog. You are the most mellow 8, until someone you love is threatened.", growth: "Soften your protective armor. Try to influence others through inspiration rather than force.", daily: "Ask a teammate or family member for their soft opinion today. Listen without deciding for them or jumping in to protect them." },
    "sx-8": { title: "Possession", key: "Possession", text: "You are the most intense and provocative 8. You want to take over the environment and have a deep, commanding influence on your partner.", growth: "Learn to sit with quiet energy. Not every interaction needs to be high-intensity or provocative.", daily: "Practice surrender in one small interaction. Let someone else choose the restaurant, the topic or the pace. Notice you are still in charge of yourself." },

    "sp-9": { title: "Appetite", key: "Appetite", text: "You find peace through comfort habits: food, a favorite show, a set routine. You merge with your physical environment to avoid the stress of life.", growth: "Wake up to your own body. Try physical movement that isn't just a routine numbing habit.", daily: "Choose one thing you've been putting off through a comfort habit. Do that thing for 15 minutes before you allow yourself to rest." },
    "so-9": { title: "Participation", key: "Participation", counter: true, text: "You work very hard for the group to keep the harmony. You are active and busy, often falling asleep to your own needs by focusing on the group's.", growth: "Practice saying no to the group. Find one goal that is purely for you and pursue it.", daily: "Speak up in a group today with an opinion that might be unpopular. Practice the healthy friction of being an individual." },
    "sx-9": { title: "Merging", key: "Merging", text: "You find peace by becoming one with your partner. You take on their interests and desires to avoid conflict and to feel a deep sense of belonging.", growth: "Define your own boundaries. Find your own opinions before merging with your partner's.", daily: "When someone asks what you want to do, don't say \"I don't care.\" Pause, check your gut and give a specific preference." }
  },

  pillars: [
    { title: "The Shadow Work", text: "Your type is not just your strength. It is also your shadow. Growth begins when you stop identifying with your defenses and start observing the fear that drives them. Ask yourself today: what am I trying to avoid by acting this way?" },
    { title: "Compassion as a Catalyst", text: "Becoming a better person starts with self-compassion. If you judge yourself for your patterns, you only tighten their grip. Change happens when you can look at your personality with the same kindness you would offer a struggling friend." },
    { title: "Conscious Contribution", text: "As you grow in self-awareness, you naturally become more effective in the world. You move from demanding that the world meet your needs to offering your unique gifts from a place of wholeness." }
  ]
};
