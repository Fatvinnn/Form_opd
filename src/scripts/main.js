// Theme + iframe load handling for survey page
(function(){
	const frame = document.getElementById('gformFrame');
	const badge = document.getElementById('statusBadge');
	const sk = document.getElementById('sk');
	const toggle = document.getElementById('themeToggle');

	// Carousel logic
	const track = document.getElementById('carouselTrack');
	const slides = track ? Array.from(track.children) : [];
	const prevBtn = document.getElementById('carouselPrev');
	const nextBtn = document.getElementById('carouselNext');
	const dotsWrap = document.getElementById('carouselDots');
	let idx = 0, autoTimer;

	function updateCarousel(newIdx) {
		if(!track) return;
		idx = (newIdx+slides.length)%slides.length;
		track.style.transform = `translateX(-${idx*100}%)`;
		if(dotsWrap) Array.from(dotsWrap.children).forEach((d,i)=>d.classList.toggle('active',i===idx));
	}
	function next(){ updateCarousel(idx+1); resetAuto(); }
	function prev(){ updateCarousel(idx-1); resetAuto(); }
	function resetAuto(){
		if(autoTimer) clearInterval(autoTimer);
		autoTimer = setInterval(()=>updateCarousel(idx+1), 6000);
	}
	if(track && slides.length>0){
		// Dots
		if(dotsWrap){
			dotsWrap.innerHTML = slides.map((_,i)=>`<button${i===0?' class="active"':''} aria-label="Slide ${i+1}"></button>`).join('');
			Array.from(dotsWrap.children).forEach((d,i)=>d.onclick=()=>{updateCarousel(i);resetAuto();});
		}
		prevBtn && (prevBtn.onclick=prev);
		nextBtn && (nextBtn.onclick=next);
		updateCarousel(0);
		resetAuto();
	}

	// Initialize theme from storage / prefers-color-scheme fallback
	const stored = localStorage.getItem('theme');
	if(stored){
		document.documentElement.setAttribute('data-theme', stored);
	} else if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches){
		document.documentElement.setAttribute('data-theme','dark');
	}
	updateToggleText();

	toggle?.addEventListener('click', ()=>{
		const cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
		document.documentElement.setAttribute('data-theme', cur);
		localStorage.setItem('theme', cur);
		updateToggleText();
	});

	function updateToggleText(){
		if(!toggle) return;
		const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
		toggle.textContent = isDark ? 'Light' : 'Dark';
	}

	// Iframe load state
	frame?.addEventListener('load', ()=>{
		frame.classList.add('loaded');
		sk?.remove();
		if(badge){
			badge.textContent = 'Siap';
			badge.className = 'badge ok';
		}
	});

	// Fallback if slow
	setTimeout(()=>{
		if(frame && !frame.classList.contains('loaded')){
			if(badge){
				badge.textContent = 'Lambat';
				badge.className = 'badge warn';
			}
		}
	}, 8000);
})();