/* Only approved, user-supplied media is listed here. */
(() => {
  const rooms = [
    {id:'music',name:'Music & Dance',icon:'♫',color:'#dd668c',description:'Move, tap, or imagine a rhythm.',title:'Make your own rhythm',steps:['Choose a comfortable position. Sitting or standing both count.','Tap, move, draw, or imagine a rhythm you enjoy.','Pause whenever you want.'],badge:'Rhythm Hero'},
    {id:'adventures',name:'Hero Adventures',icon:'★',color:'#e4a735',description:'Imagine a mission with the team.',title:'Plan a team adventure',steps:['Imagine a place where the team could help.','Think of one small act of kindness.','Choose how the team can include everyone.'],badge:'Adventure Hero'},
    {id:'learning',name:'Learning Lab',icon:'✦',color:'#5b9bc3',description:'Notice, wonder, and explore.',title:'Notice something new',steps:['Choose a safe object or picture.','Notice a detail that interests you.','Think, draw, or ask a question about it.'],badge:'Curiosity Star'},
    {id:'calm',name:'Calm Corner',icon:'☁',color:'#69a78a',description:'Take a pause in your own way.',title:'Choose your comfort',steps:['Notice what would feel comfortable right now.','Choose quiet, a stretch, a familiar object, or a break.','Take as much time as you want. You can skip any step.'],badge:'Comfort Hero'}
  ];
  const musicVideos = [
    {id:'Rb1lljqbJdA', title:'Original Music Video'},
    {id:'6iHHPwYN7Zg', title:'Sing Along with Lyrics'},
    {id:'tHgUhYfgUIw', title:'Instrumental with Lyrics'}
  ];
  let musicVideoId = musicVideos[0].id;
  const read = (key) => {try {const value=JSON.parse(localStorage.getItem(key)||'[]');return new Set(Array.isArray(value)?value.filter(id=>rooms.some(r=>r.id===id)):[]);}catch{return new Set();}};
  const favorites=read('ssh_theater_favorites'), completed=read('ssh_theater_missions');
  let selected='adventures', onlyFavorites=false, welcome=false;
  const root=document.getElementById('theater');
  const status=root.querySelector('[role=status]');
  const announce=message=>{status.textContent=message;};
  const save=(key,value)=>{try{localStorage.setItem(key,JSON.stringify([...value]));return true;}catch{announce('Storage is unavailable. Changes will last for this visit only.');return false;}};
  const theaterBadges=rooms.map(room=>({id:'theater-'+room.id,icon:room.icon,title:room.badge,text:'Complete the '+room.name+' theater mission.',ok:()=>completed.has(room.id)}));
  badgeDefinitions.push(...theaterBadges);
  badgeCatalog.push(...theaterBadges.map(b=>({...b,requirement:b.text})));
  function stopVideo(){
    root.querySelectorAll('video').forEach(video=>video.pause());
    // Unload embedded media so sound stops even when YouTube's API is unavailable.
    root.querySelectorAll('iframe[data-theater-youtube]').forEach(frame=>frame.remove());
  }
  function renderMusicPlayer(){
    const selectedVideo=musicVideos.find(video=>video.id===musicVideoId);
    root.querySelector('#theaterScreen').innerHTML=`<div class="theater-video-choices" role="group" aria-label="Choose a music video">${musicVideos.map(video=>`<button type="button" class="cta secondary" data-music-video="${video.id}" aria-pressed="${video.id===musicVideoId}">${video.title}</button>`).join('')}</div><h3>${selectedVideo.title}</h3><div class="theater-youtube-player"><iframe data-theater-youtube src="https://www.youtube-nocookie.com/embed/${selectedVideo.id}?autoplay=0&amp;playsinline=1&amp;rel=0" title="Spectrum Super Hero — ${selectedVideo.title}" loading="lazy" allow="encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div><p><a href="https://www.youtube.com/watch?v=${selectedVideo.id}" target="_blank" rel="noopener noreferrer">Watch ${selectedVideo.title} on YouTube</a></p><p>Press play when you are ready. YouTube playback needs an internet connection. If the player is unavailable, use the YouTube link above.</p>`;
  }
  function render(){
    stopVideo();
    const visible=rooms.filter(room=>!onlyFavorites||favorites.has(room.id));
    root.querySelector('#theaterRooms').innerHTML=visible.length?visible.map(room=>`<button type="button" class="theater-room" data-room="${room.id}" style="--room-color:${room.color}" aria-pressed="${selected===room.id&&!welcome}"><span aria-hidden="true">${room.icon}</span><strong>${room.name}</strong>${room.description}${favorites.has(room.id)?' · Favorite':''}</button>`).join(''):'<p>No favorite rooms yet. Turn off “Favorites only” and save a room.</p>';
    const room=rooms.find(r=>r.id===selected);
    root.querySelector('#theaterRoomTitle').textContent=welcome?'Welcome to Spectrum Super Hero':room.name;
    root.querySelector('#theaterScreen').innerHTML=welcome?'<video controls playsinline preload="metadata" poster="media/spectrum-super-hero-intro-poster.png" aria-label="Spectrum Super Hero welcome video"><source src="media/spectrum-super-hero-intro.mp4" type="video/mp4"></video><p>The existing app welcome video. Captions are not yet available for this video.</p>':`<div class="theater-placeholder"><span aria-hidden="true" style="font-size:44px">${room.icon}</span><h3>${room.name} videos are coming soon</h3><p>You can try the optional mission now. There is no video to play in this room yet.</p></div>`;
    if(!welcome && selected==='music')renderMusicPlayer();
    const video=root.querySelector('video');if(video)video.addEventListener('error',()=>announce('The welcome video could not load. Try again when you are online.'));
    root.querySelector('#theaterMission').innerHTML=`<span class="pill">OPTIONAL MISSION</span><h3>${room.title}</h3><ol>${room.steps.map(step=>`<li>${step}</li>`).join('')}</ol><p>Think, draw, use AAC, or ask someone to join. No timer or proof needed.</p><p><strong>Reward:</strong> ${room.badge} in your Badge Cabinet.</p><button type="button" class="cta" id="theaterComplete" ${completed.has(room.id)?'disabled':''}>${completed.has(room.id)?'Mission completed ✓':'Complete mission'}</button>`;
    const favorite=root.querySelector('#theaterFavorite');favorite.textContent=favorites.has(room.id)?'♥ Saved to favorites':'♡ Save room to favorites';favorite.setAttribute('aria-pressed',String(favorites.has(room.id)));
    root.querySelector('#theaterProgress').textContent=`${completed.size} of 4 missions completed · Saved on this device`;
  }
  root.addEventListener('click',event=>{
    const musicButton=event.target.closest('[data-music-video]');
    if(musicButton){musicVideoId=musicButton.dataset.musicVideo;stopVideo();renderMusicPlayer();root.querySelector(`[data-music-video="${musicVideoId}"]`)?.focus();announce(musicVideos.find(video=>video.id===musicVideoId).title+' selected. Press play when you are ready.');}
    const roomButton=event.target.closest('[data-room]');
    if(roomButton){selected=roomButton.dataset.room;welcome=false;render();root.querySelector(`[data-room="${selected}"]`)?.focus();announce(rooms.find(r=>r.id===selected).name+' selected.');}
    if(event.target.id==='theaterFavorite'){if(favorites.has(selected))favorites.delete(selected);else favorites.add(selected);const persisted=save('ssh_theater_favorites',favorites);render();if(persisted)announce('Favorites updated.');}
    if(event.target.id==='theaterComplete'&&!completed.has(selected)){completed.add(selected);const persisted=save('ssh_theater_missions',completed);render();markNewBadges();renderDashboard();renderJourney();renderRewards();renderBadgeCabinet();renderHeroProfile();document.getElementById('levelJourneyPanel').style.display='none';root.querySelector('#theaterFavorite').focus();if(persisted)announce('Mission complete! Your badge is in the Badge Cabinet.');}
    if(event.target.id==='theaterWelcome'){welcome=true;render();root.querySelector('video').focus();}
  });
  root.querySelector('#theaterFavoritesOnly').addEventListener('change',event=>{onlyFavorites=event.target.checked;render();});
  // Reuse the app's accessibility preferences, including its profile controls.
  root.querySelector('#theaterAccessibility').addEventListener('click',()=>show('profile'));
  const originalShow=window.show;
  window.show=function(id){stopVideo();if(id==='theater'){document.getElementById('homeHeroIntro')?.pause();render();}return originalShow(id);};
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stopVideo();else if(root.classList.contains('active')&&!welcome&&selected==='music'&&!root.querySelector('iframe[data-theater-youtube]'))renderMusicPlayer();});
  render();
})();
