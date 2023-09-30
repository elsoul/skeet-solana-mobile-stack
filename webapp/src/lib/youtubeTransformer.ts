const youtubeTransformer = {
  name: 'YouTube',
  shouldTransform(url: string) {
    return /https?:\/\/(www\.)?youtube\.com\/watch\?v=/.test(url)
  },
  getHTML(url: string) {
    const videoId = new URL(url).searchParams.get('v')
    if (!videoId) {
      return ''
    }
    return `
      <div class="video-wrapper">
        <iframe
          src="https://www.youtube.com/embed/${videoId}"
          frameborder="0"
          allowfullscreen
        ></iframe>
      </div>
    `
  },
}

export default youtubeTransformer
