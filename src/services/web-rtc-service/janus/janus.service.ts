import { WebRTCService } from '../webRtcService.interface';
import { Janus } from "janus-gateway";
import eventHub from "../../event-hub/eventHub";




export default class JanusService implements WebRTCService {
    rtcInstence?: object;
    pluginHandle: object;
    feeds: [];
    maxFeeds: number;
    privateId: number;
    id: number;

    constructor(options) {
        const { displayName, roomNumber } = options;

        this.feeds = [];
        Janus.init({
            debug: true,
            dependencies: Janus.useDefaultDependencies(),
            callback: function () {
                Janus.debug("janus initiated!");
            }
        });

        this.rtcInstence = new Janus(
            {
                server: "wss://janus.conf.meetecho.com/ws",
                //opaqueId  ?
                success: () => {
                    this.rtcInstence.attach({
                        plugin: "janus.plugin.videoroom",
                        success: (pluginHandle) => {
                            this.pluginHandle = pluginHandle;
                            this.joinRoom(roomNumber, displayName);
                        },
                        error: (error: Error) => Janus.error("Error attaching plugin...", error),
                        consentDialog: (on) => { },
                        webrtcState: (on) => Janus.log("Janus says our WebRTC PeerConnection is " + (on ? "up" : "down") + " now"),
                        onmessage: (msg, jsep) => {
                            Janus.debug(msg);
                            var event = msg["videoroom"];
                            if (event !== undefined && event !== null) {
                                if (event === "joined") {// Publisher/manager created, negotiate WebRTC and attach to existing feeds, if any

                                    eventHub.trigger("userSet", { id: msg["id"] });
                                    eventHub.trigger("participantJoined", { id: msg["id"], displayName })
                                    this.id = msg["id"]
                                    this.privateId = msg["private_id"];
                                    this.publishOwnFeed(true)
                                    Janus.log("Successfully joined room " + msg["room"] + " with ID " + msg["id"]);

                                    if (msg["publishers"] !== undefined && msg["publishers"] !== null) {
                                        this.attachFeed(msg["publishers"]);
                                    }
                                } else if (event === "destroyed") {

                                    Janus.warn("The room has been destroyed!");
                                    alert("The room has been destroyed");
                                }
                                else if (event === "event") {
                                    // Any new feed to attach to?

                                    if (msg["joining"] !== undefined && msg["joining"] !== null)
                                        console.log("new---joined", msg)
                                    if (msg["publishers"] !== undefined && msg["publishers"] !== null) {
                                        console.log("new---publsisher", msg)
                                        this.attachFeed(msg["publishers"]);

                                    } else if (msg["leaving"] !== undefined && msg["leaving"] !== null) {

                                        const leaving = msg["leaving"];
                                        eventHub.trigger('participantLeft', leaving)
                                        let remoteFeed = null;

                                        for (let i = 1; i < this.maxFeeds; i++) {
                                            if (this.feeds[i] !== null && this.feeds[i] !== undefined && this.feeds[i].rfid === leaving) {
                                                remoteFeed = this.feeds[i];
                                                break;
                                            }
                                        }
                                        if (remoteFeed != null) {
                                            Janus.debug("Feed " + remoteFeed.rfid + " (" + remoteFeed.rfdisplay + ") has left the room, detaching");
                                            this.feeds[remoteFeed.rfindex] = null;
                                            remoteFeed.detach();
                                        }
                                    } else if (msg["unpublished"] !== undefined && msg["unpublished"] !== null) {
                                        // One of the publishers has unpublished?
                                        var unpublished = msg["unpublished"];
                                        eventHub.trigger('participantLeft', unpublished)
                                        Janus.log("Publisher left: " + unpublished);
                                        if (unpublished === 'ok') {
                                            // That's us
                                            this.pluginHandle.hangup();
                                            return;
                                        }
                                        var remoteFeed = null;
                                        for (var i = 1; i < 6; i++) {
                                            if (this.feeds[i] !== null && this.feeds[i] !== undefined && this.feeds[i].rfid === unpublished) {
                                                remoteFeed = this.feeds[i];
                                                break;
                                            }
                                        }
                                        if (remoteFeed !== null) {
                                            Janus.debug("Feed " + remoteFeed.rfid + " (" + remoteFeed.rfdisplay + ") has left the room, detaching");

                                        }
                                    } else if (msg["error"] !== undefined && msg["error"] !== null) {
                                        if (msg["error_code"] === 426) {
                                            // This is a "no such room" error: give a more meaningful description
                                            alert(`
                                                "<p>Apparently room <code>" + "myroom" + "</code> (the one this demo uses as a test room) " +
                                                "does not exist...</p><p>Do you have an updated <code>janus.plugin.videoroom.cfg</code> " +
                                                "configuration file? If not, make sure you copy the details of room <code>" + "myroom" + "</code> " +
                                                "from that sample in your current configuration file, then restart Janus and try again."
                                           `);
                                        } else {
                                            alert(msg["error"]);
                                        }
                                    }
                                }
                            }
                            if (jsep !== undefined && jsep !== null) {
                                Janus.debug("Handling SDP as well...");
                                Janus.debug(jsep);
                                this.pluginHandle.handleRemoteJsep({ jsep: jsep });
                                // Check if any of the media we wanted to publish has
                                // been rejected (e.g., wrong or unsupported codec)


                                // var audio = msg["audio_codec"];
                                // if (mystream && mystream.getAudioTracks() && mystream.getAudioTracks().length > 0 && !audio) {
                                //     // Audio has been rejected
                                //     toastr.warning("Our audio stream has been rejected, viewers won't hear us");
                                // }
                                // var video = msg["video_codec"];
                                // if (mystream && mystream.getVideoTracks() && mystream.getVideoTracks().length > 0 && !video) {
                                //     // Video has been rejected
                                //     toastr.warning("Our video stream has been rejected, viewers won't see us");
                                //     // Hide the webcam video
                                //     $('#myvideo').hide();
                                //     $('#videolocal').append(
                                //         '<div class="no-video-container">' +
                                //         '<i class="fa fa-video-camera fa-5 no-video-icon" style="height: 100%;"></i>' +
                                //         '<span class="no-video-text" style="font-size: 16px;">Video rejected, no webcam</span>' +
                                //         '</div>');
                            }
                        }
                    })
                },
                error: function (cause) {

                },
                destroyed: function () {
                    // I should get rid of this
                }
            },


        );
    }


    sendMessage = (message) => {
        const data = {
            message,
            id: this.id,

        }

        this.pluginHandle.data({
            text: JSON.stringify(data),
            error: function (reason) { alert(reason); },
            success: function () {

            },
        });
    }


    // trying to create a room require an admin key, when you dont have on it Janus throws a 429 error_code
    createRoom = (roomNumber) => {
        const create = {
            "request": "create",
            "token": "",
            "room": roomNumber,
            "ptype": "publisher",
            "description": ("labelRoomNumber' + 'myRoomNumber"),
            // "publishers": maxVideoBox,
            // "bitrate": maxBitRate,
            // "audiocodec": audioCodec,
            // "videocodec": videoCodec
            "is_private": true
        };

        Janus.debug("Create room request");
        this.pluginHandle.send({
            "message": create,
            success: (resp) => {
                if (resp.videoroom === "created") {
                    Janus.debug("New room " + roomNumber + " has been created");


                } else if (resp.videoroom === "event") {
                    if (resp.error_code === 427) {
                        Janus.debug("Requested room " + roomNumber + " already exists");
                        console.log('exsit')
                    }
                }

            }
        });
    }

    joinRoom = (roomNumber, displayName) => {
        var join = { "request": "join", "room": roomNumber, "ptype": "publisher", "display": displayName };
        Janus.debug("User " + displayName + " join room " + roomNumber + " request");
        this.pluginHandle.send({ "message": join });
    }

    attachFeed = (list) => {

        Janus.debug("Got a list of available publishers/feeds:");
        Janus.debug(list);
        for (let f in list) {
            const id = list[f]["id"];
            const displayName = list[f]["display"];
            const audio = list[f]["audio_codec"];
            const video = list[f]["video_codec"];
            console.log('attacch----', id, "+++", displayName)
            eventHub.trigger("participantJoined", { id, displayName })
            Janus.debug("  >> [" + id + "] " + displayName + " (audio: " + audio + ", video: " + video + ")");
            this.newRemoteFeed(id, displayName, 1234);
        }
    }

    publishOwnFeed = (useAudio) => {
        // Publish our stream ------here the peer connection is set 

        this.pluginHandle.createOffer(
            {
                media: {
                    //  audioRecv: false,
                    //  videoRecv: false,
                     audioSend: false,
                     videoSend: false, 
                    data: true
                },
                // If you want to test simulcasting (Chrome and Firefox only), then
                // pass a ?simulcast=true when opening this demo page: it will turn
                // the following 'simulcast' property to pass to janus.js to true
                // simulcast: doSimulcast,
                success: (jsep) => {
                    Janus.debug("Got publisher SDP!");
                    Janus.debug(jsep);
                    var publish = {
                        "request": "configure",
                        // "audio": useAudio,
                        // "video": true ,
                        // "audiocodec":"opus",
                        // "videocodec":"vp9"
                    };
                    // to force VP9 as the videocodec to use. In both case, though, forcing
                    // a codec will only work if: (1) the codec is actually in the SDP (and
                    // so the browser supports it), and (2) the codec is in the list of
                    // allowed codecs in a room. With respect to the point (2) above,
                    // refer to the text in janus.plugin.videoroom.cfg for more details
                    this.pluginHandle.send({ "message": publish, "jsep": jsep }); //publish reque
                },
                error: function (error) {
                    Janus.error("WebRTC error:", error);
                    if (useAudio) {
                        // this.publishOwnFeed(false);
                    } else {
                        // bootbox.alert("WebRTC error... " + JSON.stringify(error));
                        // $('#publish').removeAttr('disabled').click(function () { publishOwnFeed(true); });
                    }
                }
            });
    }

    newRemoteFeed = (id, display, roomNumber) => {
        // A new feed has been published, create a new plugin handle and attach to it as a listener
        let remoteFeed = null;
        this.rtcInstence.attach({
            plugin: "janus.plugin.videoroom",
            success: (pluginHandle) => {
                remoteFeed = pluginHandle;
                Janus.log("Plugin attached! (" + remoteFeed.getPlugin() + ", id=" + remoteFeed.getId() + ")");
                Janus.log("  -- This is a subscriber");
                // We wait for the plugin to send us an offer
                const listen = { "request": "join", "token": "", "room": roomNumber, "ptype": "listener", "feed": id };
                remoteFeed.send({ "message": listen });
            },
            error: (error) => {
                Janus.error("  -- Error attaching plugin...", error);
                alert("Error attaching plugin... " + error);
            },
            onmessage: (msg, jsep) => {
                Janus.debug(" ::: Got a message (listener) :::");
                Janus.debug(JSON.stringify(msg));
                var event = msg["videoroom"];
                Janus.debug("Event: " + event);
                if (event !== undefined && event != null) {
                    if (event === "attached") {
                        // Subscriber created and attached
                        for (let i = 1; i < this.maxFeeds; i++) {
                            if (this.feeds[i] === undefined || this.feeds[i] === null) {
                                this.feeds[i] = remoteFeed;
                                remoteFeed.rfindex = i;
                                break;
                            }
                        }
                        remoteFeed.rfid = msg["id"];
                        remoteFeed.rfdisplay = msg["display"];
                        Janus.log("Successfully attached to feed " + remoteFeed.rfid + " (" + remoteFeed.rfdisplay + ") in room " + msg["room"]);

                    } else if (msg["error"] !== undefined && msg["error"] !== null) {
                        alert(msg["error"]);
                    } else {
                        // What has just happened?
                    }
                }
                if (jsep !== undefined && jsep !== null) {
                    Janus.debug("Handling SDP as well...");
                    Janus.debug(jsep);
                    // Answer and attach
                    remoteFeed.createAnswer({
                        jsep: jsep,
                        media: {
                            audioSend: false,
                            videoSend: false,
                            // video: defaultResolution,
                            data: true
                        },	// We want recvonly audio/video
                        trickle: true,
                        success: function (jsep) {
                            Janus.debug("Got SDP!");
                            Janus.debug(jsep);
                            var body = { "request": "start", "token": "", "room": roomNumber };
                            remoteFeed.send({ "message": body, "jsep": jsep });
                        },
                        error: function (error) {
                            Janus.error("WebRTC error:", error);
                            alert("WebRTC error... " + JSON.stringify(error));
                        }
                    });
                }
            },
            onlocalstream: function (stream) {
                // The subscriber stream is recvonly, we don't expect anything here
            },
            ondata: function (data) {
                console.log(data);
                eventHub.trigger("messageReceived", JSON.parse(data));
            },
            onremotestream: function (stream) {
                Janus.debug("Remote feed #" + remoteFeed.rfindex);
                // if ($('#remotevideo' + remoteFeed.rfindex).length === 0) {
                //     // No remote video yet
                //     $('#videoremote' + remoteFeed.rfindex).append('<video class="videobox rounded centered" id="remotevideo' + remoteFeed.rfindex + '" width="' + videoBoxWidth + '" height="' + videoBoxHeight + '" autoplay/>');
                // }
                // $('#videoremote' + remoteFeed.rfindex).append(
                //     // Add a 'displayname' label
                //     '<span class="label label-success" id="displayname" style="position: absolute; top: 7px; left: 7px;">' + remoteFeed.rfdisplay + '</span>' +
                //     '<span class="label label-default hide" id="curres' + remoteFeed.rfindex + '" style="position: absolute; bottom: 7px; left: 7px;"></span>' +
                //     '<span class="label label-default hide" id="curbitrate' + remoteFeed.rfindex + '" style="position: absolute; bottom: 7px; right: 7px;"></span>');
                // $("#remotevideo" + remoteFeed.rfindex).bind("playing", function () {
                //     $('#remotevideo' + remoteFeed.rfindex).removeClass('hide');
                //     var width = this.videoWidth;
                //     var height = this.videoHeight;
                //     $('#curres' + remoteFeed.rfindex).removeClass('hide').text(width + 'x' + height).show();
                //     if (webrtcDetectedBrowser == "firefox") {
                //         // Firefox Stable has a bug: width and height are not immediately available after a playing
                //         setTimeout(function () {
                //             var width = $("#remotevideo" + remoteFeed.rfindex).get(0).videoWidth;
                //             var height = $("#remotevideo" + remoteFeed.rfindex).get(0).videoHeight;
                //             $('#curres' + remoteFeed.rfindex).removeClass('hide').text(width + 'x' + height).show();
                //         }, 2000);
                //     }
                //     if (webrtcDetectedBrowser == "chrome" || webrtcDetectedBrowser == "firefox") {
                //         $('#curbitrate' + remoteFeed.rfindex).removeClass('hide').show();
                //         bitrateTimer[remoteFeed.rfindex] = setInterval(function () {
                //             // Display updated bitrate, if supported
                //             var bitrate = remoteFeed.getBitrate();
                //             $('#curbitrate' + remoteFeed.rfindex).text(bitrate);
                //         }, 1000);
                //     }
                // });
                // attachMediaStream($('#remotevideo' + remoteFeed.rfindex).get(0), stream);
                // var videoTracks = stream.getVideoTracks();
                // if (videoTracks === null || videoTracks === undefined || videoTracks.length === 0 || videoTracks[0].muted) {
                //     // No remote video
                //     $('#remotevideo' + remoteFeed.rfindex).hide();
                //     $('#videoremote' + remoteFeed.rfindex).append('<div class="videobox-novideo">' + labelNoRemoteVideo + '</div>');
                // }

                // appendNewChat(remoteFeed.rfdisplay + labelUserJoinChat, "NOTIFICATION");

                // membercount++;
                // flashTitle(membercount);
            },
            oncleanup: function () {
                // Janus.log(" ::: Got a cleanup notification (remote feed " + id + ") :::");
                // $('#curbitrate' + remoteFeed.rfindex).remove();
                // $('#curres' + remoteFeed.rfindex).remove();
                // if (bitrateTimer[remoteFeed.rfindex] !== null && bitrateTimer[remoteFeed.rfindex] !== null) {
                //     clearInterval(bitrateTimer[remoteFeed.rfindex]);
                // }
                // bitrateTimer[remoteFeed.rfindex] = null;

                // // fixme anton - if this is the currently speaking one then set videolocal
                // if (isSpeakingId == 'videoremote' + remoteFeed.rfindex) {
                //     $('#videofocus').empty();
                //     setLargeVideo('videolocal');
                // }

                // appendNewChat(remoteFeed.rfdisplay + labelUserLeaveChat, "NOTIFICATION");

                // membercount--;
                // flashTitle(membercount);
            }
        })
    }


}