// prettier-ignore
/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/camelcase */
/** Handles emoji logic */
export default class Emoji {
  // do this client side for real-time changes
  /** the emojis the chat will auto convert */
  repl: Readonly< Map<string, string> >;
  /** for emoji replacements */
  emoji_repl: RegExp;
  /** to check if something is only unicode emojis */
  emoji_regex: RegExp;

  constructor() {
    this.repl = Object.freeze(new Map([
      [';)', '😉'], [':devil:', '😈'], [':uwu:', '🥺'], [':nervous:', '🥺👉👈'],
      [':D','😁'], ['(:','🙃'], [':)','🙂'], ['<3', '❤️'],
      [':(','🙁'], ['):','🙁'], ['D:','😟'],
      [':o','😲'], [':p','😛'], [';p','😜'],
      ['->','→'], ['<-','←'], [':^','↑'], [':v','↓'],
    ]));
    this.emoji_repl = new RegExp(
      Array.from(this.repl.keys())
        .map(s => s.toLowerCase().replace(/[\(\)\\\^]/g, m => `\\${m}`))
        .join('|')
      , 'gi');
    this.emoji_regex = /^(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\s|❤️|\u2934|\u2935|[\u2190-\u21ff])+$/;
  }

  /**
   * @param {string} text
   * @returns {string}
   */
  emojify(text: string): string {
    return text.replace(this.emoji_repl, m =>
      ( this.repl.has(m) ? this.repl.get(m) :
          this.repl.has(m.toLowerCase()) ? this.repl.get(m.toLowerCase()) : m ) || ""
    );
  }

  /**
   * @param {string} text the text to check
   * @returns {boolean} if text contains only unicode emoji characters
   */
  only(text:string): boolean {
    // thanks SO: https://stackoverflow.com/users/6558042/omid-nikrah
    return this.emoji_regex.test(text);
  }
}