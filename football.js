

class FootballDbWidget {

  constructor( widget_id, opts={}) {
    this.widget_id = widget_id;
    this.opts      = opts;

    this.$widget =   document.getElementById( widget_id );
    this.data    =  {};

    this.fetch( this.opts.service || "2018/worldcup" );
  }


  fetch( service )
  {
    const that = this;
    const url = "https://raw.githubusercontent.com/openfootball/world-cup.json/master/" + service + ".json";
    fetch( url )
    .then( (resp) => resp.json() )
    .then( function( data ) {
      console.log( "fetch data:" );
      console.log( data );
      that.data = data;
      that.update_header();
      that.update_round( 0 );    // note: index starts at zero
    })
    .catch(function(err) { console.log(err); });
  }


  update_header()
  {
      const data = this.data;

      let snippet = "";  // build up a hypertext (html) snippet to add/append
      snippet += `<h2>${data.name}</h2>`;
      snippet += "<div>";
      for( const [idx,round] of data.rounds.entries()) {
        snippet += `<span id="round${idx+1}" title="${round.name}"> ${idx+1} </span>`;
      }
      snippet += "</div>";
      snippet += `<div id="matches"></div>`;

      this.$widget.innerHTML = snippet;

      // add onclick handlers
      for( const [idx,round] of data.rounds.entries()) {
        // note: getElementById is only for document (ids should be unique anyways :-))
        //        thus, use querySelector for now
        const $round = this.$widget.querySelector( `#round${idx+1}` );
        $round.addEventListener( "click", ()=>this.update_round( idx ) );
      }
}  // fn update_header


  update_round( pos )
  {
      console.log( `update_round( ${pos} )` );

      const data = this.data;

      // note: getElementById is only for document (ids should be unique anyways :-))
      //        thus, use querySelector for now
      const $matches = this.$widget.querySelector( "#matches" );


      let snippet = "";  // build up a hypertext (html) snippet to add/append
      snippet += `<h3>${data.rounds[pos].name}</h3>`;

      for( const match of data.rounds[pos].matches) {
        snippet += "<div>";
        if( match.num )
          snippet += `#${match.num} | `;

        const date = new Date( match.date );
        var opts = { weekday: 'short',  month: 'short', day: 'numeric' };

        snippet += `${date.toLocaleDateString( "en-US", opts )} ${match.time} `;
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
        if( match.group )
         snippet += ` / ${match.group}`

        if( match.city )
          snippet += ` @ ${match.city} (${match.timezone})`;
        snippet += "</div>";
      }

      $matches.innerHTML = snippet;
  }  // fn update
}  // class FootballDbWidget
