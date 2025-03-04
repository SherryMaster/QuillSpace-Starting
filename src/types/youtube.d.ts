interface YT {
  Player: any;
  PlayerState: {
    UNSTARTED: -1;
    ENDED: 0;
    PLAYING: 1;
    PAUSED: 2;
    BUFFERING: 3;
    CUED: 5;
  };
}

interface Window {
  YT?: YT;
  onYouTubeIframeAPIReady?: () => void;
}
