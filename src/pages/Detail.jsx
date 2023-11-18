import React, { useEffect, useState } from "react";
import DetailHeader from "../components/DetailHeader";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { registerComment } from "../apis/comment";
import { getRecord } from "../apis/record";
import { registerBookmark, removeBookmark } from "../apis/bookmark";
import { bgColor } from "../const/bgColor";
import { convertDate } from "../utils/common";
import { ReactComponent as Edit } from "../assets/edit.svg";
import { ReactComponent as StickerOutline } from "../assets/sticker_outline.svg";
import { ReactComponent as StickerColor } from "../assets/sticker_color.svg";
import { ReactComponent as BookmarkOn } from "../assets/bookmark_on.svg";
import { ReactComponent as BookmarkOff } from "../assets/bookmark_off.svg";
import DefaultProfileImage from "../assets/profile_none.svg";
import LoadingSpinner from "../components/LoadingSpinner";

const username = "";

const Detail = () => {
  const stickerList = ["😍", "😆", "😋", "😔", "😭", "😡"];
  const [record, setRecord] = useState(null);
  const [showStickers, setShowStickers] = useState(false);
  const [isClickedStickers, setIsClickedStickers] = useState(false);
  const [bookmark, setBookmark] = useState(null);
  const [userCommentList, setUserCommentList] = useState(null);
  const { recordId } = useParams();

  const toggleStickersState = () => {
    setShowStickers((prev) => !prev);
    setIsClickedStickers((prev) => !prev);
  };
  const onClickSticker = async (e) => {
    const clickedEmoji = e.currentTarget.children[0].innerText;
    if (userCommentList && userCommentList.includes(clickedEmoji) === false) {
      setUserCommentList([...userCommentList, clickedEmoji]);
    }
    const newComment = await registerComment(recordId, clickedEmoji);
    console.log(newComment);

    toggleStickersState();
  };

  const onClickBookmark = async () => {
    if (bookmark === null) {
      const response = await registerBookmark(recordId);
      setBookmark(response.data.newBookmark.id);
    } else {
      const response = await removeBookmark(recordId);
      if (response.data.status === "ok") setBookmark(null);
    }
  };
  const onClickStickers = () => {
    toggleStickersState();
  };

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const { data } = await getRecord(recordId);
        setRecord(data.record);
        setBookmark(data.record.bookmarkId);
        setUserCommentList(data.record.commentList);
      } catch (error) {
        console.error("API 호출 오류:", error);
      }
    };

    fetchRecord();
  }, [recordId]);

  if (record === null) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <Wrapper>
      <DetailHeader type="detail" />
      {record.image === null ||
      record.image === undefined ||
      record.image.length === 0 ? (
        <BackgroundCard
          $background={
            bgColor[record.background] ? bgColor[record.background] : "#5B554E"
          }
        />
      ) : (
        <BackgroundImageContainer>
          <BackgroundImage src={record.image} alt="background-image" />
        </BackgroundImageContainer>
      )}
      <DetailWrapper>
        <DetailContainer>
          <DetailContents>
            <div className="record-main">
              <p className="record-title">{record.title}</p>
              <p className="record-content">{record.content}</p>
            </div>
            <div className="record-info">
              <div className="user-info">
                <a href={`http://localhost:3000/my/userId`}>
                  {record.profileImage !== "" ? (
                    <ProfileImage
                      src={record.profileImage}
                      alt="user-profile-image"
                    />
                  ) : (
                    <ProfileImage
                      src={DefaultProfileImage}
                      alt="user-profile-image"
                    />
                  )}
                </a>
                <p>{`by ${record.writer}`}</p>
              </div>
              <p>{convertDate(record.created_at)}</p>
            </div>
          </DetailContents>
          <UserInteractions>
            <div className="user-sympathy">
              {showStickers && (
                <StickerBalloon>
                  {stickerList.map((sticker) => (
                    <button
                      key={sticker}
                      className="sticker"
                      type="button"
                      onClick={onClickSticker}
                    >
                      <p className="sticker-emoji">{sticker}</p>
                    </button>
                  ))}
                </StickerBalloon>
              )}
              <button type="button" onClick={onClickStickers}>
                {isClickedStickers ? <StickerColor /> : <StickerOutline />}
              </button>
              <div className="comment-list">
                {userCommentList &&
                  userCommentList.map((comment, index) => (
                    <CommentSticker
                      key={comment}
                      $length={userCommentList.length}
                      $index={index}
                    >
                      {comment}
                    </CommentSticker>
                  ))}
              </div>
            </div>
            <div>
              {username === record.writer ? (
                <Edit />
              ) : (
                <button type="button" onClick={onClickBookmark}>
                  {bookmark !== null ? <BookmarkOn /> : <BookmarkOff />}
                </button>
              )}
            </div>
          </UserInteractions>
        </DetailContainer>
      </DetailWrapper>
    </Wrapper>
  );
};

export default Detail;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const BackgroundCard = styled.div`
  position: absolute;
  width: 414px;
  height: 100%;
  background-color: ${(props) => props.$background};
  z-index: -1;
`;

const BackgroundImageContainer = styled.div`
  background-position: center;
`;

const BackgroundImage = styled.img`
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  filter: brightness(60%);
`;

const DetailWrapper = styled.div`
  padding-top: 68px;
`;

const DetailContainer = styled.div`
  padding: 8px 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 90px;
`;

const DetailContents = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 470px;
  gap: 4rem;

  p {
    color: rgb(255, 255, 255, 0.85);
    font-weight: 300;
    font-size: 1.8rem;
  }

  .record-main {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  .record-title {
    width: 320px;
    ${(props) => props.theme.font["title-extra"]};
  }
  .record-content {
    width: 320px;
    height: 350px;
    ${(props) => props.theme.font["body-large"]};
  }
  .record-info {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    p {
      font-size: 1.5rem;
      font-weight: 300;
      color: rgb(255, 255, 255, 0.45);
    }
  }
  .user-info {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }
`;

const UserInteractions = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;

  .user-sympathy {
    position: relative;
    display: flex;
    align-items: center;
  }
  .comment-list {
    position: relative;
    display: flex;
  }
`;

const CommentSticker = styled.div`
  position: absolute;
  top: -1.3rem;
  left: ${(props) => props.$index * 2}rem;
  background-color: white;
  width: 24px;
  height: 24px;
  text-align: center;
  line-height: 250%;
  border-radius: 20px;
  box-shadow: 2px 0px 2px 0px rgba(0, 0, 0, 0.25);
  z-index: ${(props) => props.$length - props.$index + 10};
`;

const StickerBalloon = styled.div`
  padding: 1rem;
  /* width: 15rem; */
  height: 5rem;
  position: absolute;
  bottom: 6rem;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  gap: 1rem;
  background-color: white;
  border-radius: 8px;

  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 0;
    border: 8px solid transparent;
    border-top-color: white;
    border-bottom: 0;
    margin-left: -45%;
    margin-bottom: -7px;
  }

  .sticker {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .sticker-emoji {
    font-size: 24px;
    text-align: center;
  }
`;

const ProfileImage = styled.img`
  width: 3rem;
  height: 3rem;
  border-radius: 20px;
`;
