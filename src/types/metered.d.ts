declare global {
  interface Window {
    Metered: {
      Meeting: new () => MeteredMeeting;
    };
  }
}

interface MeteredMeeting {
  join(options: { roomURL: string; name: string }): Promise<any>;
  startVideo(): Promise<void>;
  startAudio(): Promise<void>;
  stopVideo(): Promise<void>;
  stopAudio(): Promise<void>;
  leave(): Promise<void>;
  on(event: string, callback: (...args: any[]) => void): void;
  off(event: string, callback: (...args: any[]) => void): void;
  listAudioInputDevices(): Promise<MediaDeviceInfo[]>;
  listVideoInputDevices(): Promise<MediaDeviceInfo[]>;
  chooseAudioInputDevice(deviceId: string): Promise<void>;
  chooseVideoInputDevice(deviceId: string): Promise<void>;
  getLocalVideoStream(): Promise<MediaStream>;
}

export {};
