import React from "react";
import Link from "next/link";
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt, faPlay } from "@fortawesome/free-solid-svg-icons";
import LikeButton from "./LikeButton";
import ShareButton from "./ShareButton";
import ReactPlayer from "react-player";
import mixpanel from "mixpanel-browser";
import AppContext from "../context/app-context";

class TokenCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spans: 0,
      moreShown: false,
      imageLoaded: false,
      showVideo: false,
      muted: true,
    };
    this.handleMoreShown = this.handleMoreShown.bind(this);
    this.divRef = React.createRef();
    //this.imageRef = React.createRef();
    this.setSpans = this.setSpans.bind(this);
  }

  componentDidMount() {
    // Set to square at first, then adjust when media loads
    this.setState({ showVideo: true, spans: 23 });
    if (this.props.item.token_has_video && !this.props.item.token_img_url) {
      // If it's a video with missing thumbnail, use onReady instead
    } else {
      this.props.item.imageRef.current.addEventListener("load", this.setSpans);
    }
  }

  componentWillUnmount() {
    if (this.props.item.imageRef.current) {
      this.props.item.imageRef.current.removeEventListener(
        "load",
        this.setSpans
      );
    }
  }

  setSpans = () => {
    if (this.divRef.current) {
      const height = this.divRef.current.clientHeight;
      const spans = Math.min(Math.ceil(height / 30 + 1), 50);
      this.setState({ spans });
    }
  };

  removeTags(str) {
    if (str === null || str === "") return false;
    else str = str.toString();
    return str.replace(/(<([^>]+)>)/gi, " ");
  }

  truncateWithEllipses(text, max) {
    return text.substr(0, max - 1) + (text.length > max ? "..." : "");
  }

  handleMoreShown = () => {
    this.setState({ moreShown: true }, this.setSpans);
  };

  getImageUrl = () => {
    var img_url = this.props.item.token_img_url
      ? this.props.item.token_img_url
      : null;

    if (img_url && img_url.includes("https://lh3.googleusercontent.com")) {
      img_url = img_url.split("=")[0] + "=s375";
    }
    return img_url;
  };

  max_description_length = 85;

  getBackgroundColor = (item) => {
    if (
      item.token_background_color &&
      item.token_background_color.length === 6
    ) {
      return `#${item.token_background_color}`;
    } else {
      return null;
    }
  };

  render() {
    const { item, showDuplicateNFTs, setShowDuplicateNFTs } = this.props;
    const hash = item.token_img_url || item.token_animation_url;
    return (
      <>
        <div
          className={`row-span-${this.state.spans} ${this.props.columns === 1 ? "pb-4" : "p-2"
            }`}
        >
          <div
            style={_.merge(
              {
                backgroundColor: "white",
              },
              this.props.columns === 1
                ? {
                  borderTopWidth: 1,
                  borderBottomWidth: 1,
                }
                : {
                  width: 375,
                  borderWidth: 1,
                }
            )}
            ref={this.divRef}
            className={
              this.props.columns === 1
                ? "mx-auto showtime-card"
                : "mx-auto showtime-card sm:rounded-md overflow-hidden"
            }
          >
            <div className="p-4 flex flex-row items-center">
              <div className="flex-shrink">
                {item.creator_address ? (
                  <Link href="/[profile]" as={`/${item?.creator_username || item.creator_address}`}>
                    <a className="flex flex-row items-center ">
                      <div>
                        <img
                          alt={item.creator_name}
                          src={
                            item.creator_img_url
                              ? item.creator_img_url
                              : "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
                          }
                          className="rounded-full"
                          style={{ height: 24, width: 24 }}
                        />
                      </div>
                      <div className="showtime-card-profile-link ml-2">
                        {this.truncateWithEllipses(item.creator_name, 30)}
                      </div>
                    </a>
                  </Link>
                ) : null}
              </div>
              <div className="flex-grow">&nbsp;</div>
            </div>
            {(item.token_has_video &&
              this.state.showVideo &&
              this.props.currentlyPlayingVideo === item.nft_id) ||
              (item.token_has_video && !item.token_img_url) ? (
              <ReactPlayer
                url={item.token_animation_url}
                playing={
                  this.props.currentlyPlayingVideo === item.nft_id ||
                  (item.token_has_video && !item.token_img_url)
                }
                loop
                controls
                muted={this.state.muted}
                width={this.props.columns === 1 ? window.innerWidth : 373}
                height={
                  item.imageRef.current ? item.imageRef.current.height : null
                }
                playsinline
                onReady={this.setSpans}
              />
            ) : (
              <div style={{ position: "relative" }}>
                <div
                  onClick={() => {
                    mixpanel.track("Open NFT modal");
                    this.props.setCurrentlyOpenModal(item);
                    this.setState({ showVideo: false, muted: true });
                    this.props.setCurrentlyPlayingVideo(null);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {!this.state.imageLoaded ? (
                    <div className="w-full text-center">
                      <div
                        className="loading-card-spinner"
                        style={{ marginTop: 148, marginBottom: 148 }}
                      />
                    </div>
                  ) : null}
                  <div
                    style={{
                      backgroundColor: this.getBackgroundColor(item),
                    }}
                  >
                    <img
                      className="w-full object-cover object-center "
                      ref={item.imageRef}
                      src={this.getImageUrl()}
                      alt={item.token_name}
                      onLoad={() => this.setState({ imageLoaded: true })}
                      style={!this.state.imageLoaded ? { display: "none" } : {}}
                    />
                  </div>
                </div>
                {item.token_has_video ? (
                  <div
                    className="p-4 playbutton"
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      mixpanel.track("Play card video");
                      this.setState({ showVideo: true, muted: false });
                      this.props.setCurrentlyPlayingVideo(item.nft_id);
                    }}
                  >
                    <FontAwesomeIcon
                      style={{
                        height: 20,
                        width: 20,
                        color: "white",
                        filter: "drop-shadow(0px 0px 10px grey)",
                      }}
                      icon={faPlay}
                    />
                  </div>
                ) : null}
              </div>
            )}

            <div className="p-4 pb-3">
              <div>
                <div className="">
                  <div
                    onClick={() => {
                      mixpanel.track("Open NFT modal");
                      this.props.setCurrentlyOpenModal(item);
                      this.setState({ showVideo: false, muted: true });
                      this.props.setCurrentlyPlayingVideo(null);
                    }}
                    className="showtime-card-title"
                    style={{
                      overflowWrap: "break-word",
                      wordWrap: "break-word",
                      fontSize: 20,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {item.token_name}

                    {/* {this.props.item.token_has_video ? (
                      <FontAwesomeIcon
                        className="ml-1 inline"
                        style={{ height: 12, marginBottom: 2 }}
                        icon={faVideo}
                      />
                    ) : null} */}
                  </div>
                  {item.token_description ? (
                    <div
                      style={{
                        fontSize: 14,
                        overflowWrap: "break-word",
                        wordWrap: "break-word",
                      }}
                      className="py-2 text-gray-500"
                    >
                      {this.state.moreShown ? (
                        <div>{this.removeTags(item.token_description)}</div>
                      ) : (
                        <div>
                          {item.token_description.length >
                            this.max_description_length ? (
                            <>
                              {this.truncateWithEllipses(
                                this.removeTags(item.token_description),
                                this.max_description_length
                              )}{" "}
                              <a
                                onClick={this.handleMoreShown}
                                style={{ color: "#111", cursor: "pointer" }}
                              >
                                {" "}
                                more
                              </a>
                            </>
                          ) : (
                            <div>{this.removeTags(item.token_description)}</div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : null}
                  <div className="flex items-center">
                    <div className="mr-2">
                      <LikeButton
                        item={item}
                        handleLike={this.props.handleLike}
                        handleUnlike={this.props.handleUnlike}
                        showTooltip={this.props.isMobile === false}
                      />
                    </div>
                    <div>
                      <ShareButton
                        url={
                          window.location.protocol +
                          "//" +
                          window.location.hostname +
                          (window.location.port
                            ? ":" + window.location.port
                            : "") +
                          `/t/${item.contract_address}/${item.token_id}`
                        }
                        type={"item"}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="flex items-end"
              style={{
                backgroundColor: "#ffffff",
                borderTopWidth: 1,
                borderColor: "rgb(219,219,219)",
              }}
            >
              <div className="mx-4 py-4 flex flex-col">
                <div
                  className="flex-shrink pr-2"
                  style={{
                    fontWeight: 400,
                    fontSize: 14,
                    color: "#888",
                  }}
                >
                  Owned by {item.multiple_owners ? "multiple owners" : null}
                </div>
                <div>
                  {item.multiple_owners ? null : item.owner_id ? (
                    <Link href="/[profile]" as={`/${item?.owner_username || item.owner_address}`}>
                      <a className="flex flex-row items-center pt-1">
                        <div>
                          <img
                            alt={item.owner_name}
                            src={
                              item.owner_img_url
                                ? item.owner_img_url
                                : "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
                            }
                            className="rounded-full mr-2"
                            style={{ height: 24, width: 24 }}
                          />
                        </div>
                        <div className="showtime-card-profile-link">
                          {this.truncateWithEllipses(item.owner_name, 22)}
                        </div>
                      </a>
                    </Link>
                  ) : null}
                </div>
              </div>
              <div className="flex-grow"></div>

              <div
                style={{ fontSize: 16, fontWeight: 400 }}
                className="mx-4 py-4"
              >
                <a
                  href={`https://opensea.io/assets/${item.contract_address}/${item.token_id}?ref=0x0c7f6405bf7299a9ebdccfd6841feac6c91e5541`}
                  target="_blank"
                  className="flex flex-row items-center showtime-card-bid"
                >
                  <div className="mr-1">Bid</div>
                  <div className="mb-0 flex">
                    <FontAwesomeIcon
                      style={{ height: 14 }}
                      icon={faExternalLinkAlt}
                    />
                  </div>
                </a>
              </div>
            </div>
          </div>
          <div
            className="text-right mr-2 mt-1 mb-2 flex flex-row"
            style={{ fontWeight: 400, fontSize: 14 }}
          >
            <div className="flex-grow"></div>
            {item.duplicate_count > 1 && (
              <div
                onClick={() => {
                  setShowDuplicateNFTs({
                    ...showDuplicateNFTs,
                    [hash]: !showDuplicateNFTs[hash],
                  });
                }}
                className="showtime-card-profile-link ml-2 cursor-pointer"
                style={{ fontWeight: 400 }}
              >
                {`${showDuplicateNFTs[hash] ? "Hide" : "Show"} ${item.duplicate_count - 1
                  } more similar`}
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
}
TokenCard.contextType = AppContext;

export default TokenCard;
