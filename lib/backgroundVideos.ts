export const BACKGROUND_VIDEOS = {
  patientDoctorAdmin: [
    "https://www.pexels.com/download/video/6129937/",
    "https://www.pexels.com/download/video/6129930/",
    "https://www.pexels.com/download/video/6130116/",
    "https://www.pexels.com/download/video/5203513/",
    "https://www.pexels.com/download/video/34440343/",
    "https://www.pexels.com/download/video/3192916/",
  ],
} as const;

export function getRandomBackgroundVideo(): string {
  const videos = BACKGROUND_VIDEOS.patientDoctorAdmin;
  const randomIndex = Math.floor(Math.random() * videos.length);
  return videos[randomIndex];
}
