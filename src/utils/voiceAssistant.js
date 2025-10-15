// Voice Assistant implementation using Web Speech API// Voice Assistant implementation using Web Speech API

export class VoiceAssistant {export class VoiceAssistant {

  constructor() {  constructor() {

    this.recognition = null;    this.recognition = null;

    this.synthesis = window.speechSynthesis;    this.synthesis = window.speechSynthesis;

    this.isListening = false;    this.isListening = false;

    this.onResult = null;    this.onResult = null;

    this.setupSpeechRecognition();    this.setupSpeechRecognition();

  }  }



  setupSpeechRecognition() {  setupSpeechRecognition() {

    if ('webkitSpeechRecognition' in window) {    if ('webkitSpeechRecognition' in window) {

      this.recognition = new window.webkitSpeechRecognition();      this.recognition = new window.webkitSpeechRecognition();

      this.recognition.continuous = false;      this.recognition.continuous = false;

      this.recognition.interimResults = false;      this.recognition.interimResults = false;

      this.recognition.lang = 'en-US';      this.recognition.lang = 'en-US';



      this.recognition.onresult = (event) => {      this.recognition.onresult = (event) => {

        const transcript = event.results[0][0].transcript;        const transcript = event.results[0][0].transcript;

        if (this.onResult) {        if (this.onResult) {

          this.onResult(transcript);          this.onResult(transcript);

        }        }

      };      };



      this.recognition.onerror = (event) => {      this.recognition.onerror = (event) => {

        console.error('Speech recognition error:', event.error);        console.error('Speech recognition error:', event.error);

      };      };



      this.recognition.onend = () => {      this.recognition.onend = () => {

        this.isListening = false;        this.isListening = false;

      };      };

    }    }

  }  }



  startListening(callback) {  startListening(callback) {

    if (!this.recognition) {    if (!this.recognition) {

      console.error('Speech recognition not supported');      console.error('Speech recognition not supported');

      return;      return;

    }    }



    this.onResult = callback;    this.onResult = callback;

    this.isListening = true;    this.isListening = true;

    this.recognition.start();    this.recognition.start();

  }  }



  stopListening() {  stopListening() {

    if (this.recognition && this.isListening) {    if (this.recognition && this.isListening) {

      this.isListening = false;      this.isListening = false;

      this.recognition.stop();      this.recognition.stop();

    }    }

  }  }



  speak(text) {  speak(text) {

    if (!this.synthesis) {    if (!this.synthesis) {

      console.error('Speech synthesis not supported');      console.error('Speech synthesis not supported');

      return;      return;

    }    }



    // Cancel any ongoing speech    // Cancel any ongoing speech

    this.synthesis.cancel();    this.synthesis.cancel();



    const utterance = new SpeechSynthesisUtterance(text);    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = 'en-US';    utterance.lang = 'en-US';

    utterance.rate = 1.0;    utterance.rate = 1.0;

    utterance.pitch = 1.0;    utterance.pitch = 1.0;

        

    this.synthesis.speak(utterance);    this.synthesis.speak(utterance);

  }  }

}}