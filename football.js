

class FootballDbWidget {

  constructor( widget_id, opts={}) {
    this.widget_id = widget_id;
    this.opts      = opts;

    this.$widget =   document.getElementById( widget_id );
    this.data    =  {}
  }


  fetch( path="2018/worldcup" )
  {
    const that = this;
    const url = "https://raw.githubusercontent.com/openfootball/world-cup.json/master/" + path + ".json";
    fetch( url )
    .then( (resp) => resp.json() )
    .then( function( data ) {
      console.log( "fetch data:" );
      console.log( data );
      that.data = data;
      that.update_round( 0 );    // note: index starts at zero
    })
    .catch(function(err) { console.log(err); });
  }

  update_round( pos )
  {
      console.log( `update_round( ${pos} )` );

      const data = this.data;

      let snippet = "";  // build up a hypertext (html) snippet to add/append
      snippet += `<h2>${data.name}</h2>`;
      snippet += "<div>";
      for( const [idx,round] of data.rounds.entries()) {
        snippet += `<span id="round${idx+1}" title="${round.name}"> ${idx+1} </span>`;
      }
      snippet += "</div>";
      snippet += `<h3>${data.rounds[pos].name}</h3>`;


      for( const match of data.rounds[pos].matches) {
        snippet += "<div>";
        snippet += `#${match.num} | `;
        snippet += `${match.date} ${match.time}  `;
        snippet += `${match.team1.name} (${match.team1.code})`;

        if( match.score1 != null && match.score2 != null ) {
          if( match.score1et != null && match.score2et != null ) {
            if( match.score1p != null && match.score2p != null ) {
              snippet += ` ${match.score1p}-${game.score2p} pen /`;
            }
            snippet += ` ${match.score1et}-${match.score2et} a.e.t. /`;
          }
          snippet += ` ${match.score1}-${match.score2}`;
        }
        else
          snippet += " vs ";

        snippet += ` ${match.team2.name} (${match.team2.code})`;
        snippet += ` @ ${match.city} (${match.timezone})`;
        snippet += "</div>";
      }


      this.$widget.innerHTML = snippet;

      // add onclick handlers
      for( const [idx,round] of data.rounds.entries()) {
        // todo/fix: limit scope use this.$widget NOT document
        const $round = document.getElementById( `round${idx+1}` );
        $round.addEventListener( "click", ()=>this.update_round( idx ) );
        // $round.style.color = "red";
      }
  }  // fn update
}
