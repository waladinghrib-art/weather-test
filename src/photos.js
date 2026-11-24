// Frontend code: asks OUR backend (/api/photos) for the images, then builds the carousel.
// The browser never talks to the Cloudinary Admin API, so it never sees your secret.

export async function loadCarousel(section) {
  const track = section.querySelector('.track');
  const status = section.querySelector('.carousel-status');
  const prev = section.querySelector('.prev');
  const next = section.querySelector('.next');

  try {
    const response = await fetch('/api/photos');
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || `Request failed with status ${response.status}`);

    if (data.photos.length === 0) {
      status.textContent = 'Your Cloudinary account has no images yet. Upload a few in the Media Library!';
      return;
    }

    track.replaceChildren(
      ...data.photos.map((photo) => {
        const slide = document.createElement('li');
        const img = document.createElement('img');
        img.src = photo.url;
        img.alt = photo.alt;
        img.loading = 'lazy';
        slide.append(img);
        return slide;
      }),
    );

    status.hidden = true;
    prev.hidden = false;
    next.hidden = false;

    const step = () => track.clientWidth;
    prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
  } catch (err) {
    status.textContent = err.message;
    status.classList.add('error');
  }
}
