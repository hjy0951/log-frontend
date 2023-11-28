import { useState } from "react";
import { useEffect } from "react";
import styled from "styled-components";
import Header from "../components/MyHeader";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ReactComponent as Posting } from "../assets/posting.svg";
import { ReactComponent as LeftArrowOn } from "../assets/ic-arrow-left-on.svg";
import { ReactComponent as RightArrowOn } from "../assets/ic-arrow-right-on.svg";
import { ReactComponent as RightArrowOff } from "../assets/ic-arrow-right-off.svg";
import ModalPortal from "../components/ModalPortal";
import DateSelectModal from "../components/DateSelectModal";

const User = () => {
  const today = new Date();
  const todayDate = `${today.getFullYear()}년 ${today.getMonth() + 1}월`;
  const [records, setRecords] = useState([]);
  const [dates, setDates] = useState([]);
  const [currentDate, setCurrentDate] = useState(todayDate);
  const [user, setUser] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(-1);
  const { userId } = useParams();
  const navigate = useNavigate();

  const filteredRecords = records.filter(
    (record) => record.date === currentDate
  );

  const onClickWrite = (e) => {
    navigate("/post");
    e.stopPropagation();
  };

  const onClickDecreaseMonth = () => {
    let [year, month] = currentDate.split(" ");
    year = +year.split("년")[0];
    month = +month.split("월")[0];

    month -= 1;
    if (month <= 0) {
      month = 12;
      year -= 1;
    }

    setCurrentDate(`${year}년 ${month}월`);
  };

  const onClickIncreaseMonth = () => {
    let [year, month] = currentDate.split(" ");
    year = +year.split("년")[0];
    month = +month.split("월")[0];

    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }

    setCurrentDate(`${year}년 ${month}월`);
  };

  const toggleShowModal = () => {
    setShowModal((prev) => !prev);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/auth/isLogin`,
          { withCredentials: true }
        );
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/record/find/${userId}`,
          { withCredentials: true }
        );
        const { records: recordsData, dates: dateData, user: userData } = data;

        setCurrentUserId(userResponse.data.user.id);
        setRecords(recordsData.reverse());
        setDates(dateData);
        setUser(userData);
      } catch (error) {
        console.error("API 호출 오류:", error);
      }
    };
    fetchData();
  }, [userId]);

  return (
    <Container>
      <Main>
        <Header isCurrentUser={user.id ? currentUserId === user.id : false} />
        <div style={{ height: "90px" }}></div>
        <Diary>
          <AvatarContainer>
            <Avatar src={user.profile} />
          </AvatarContainer>
          <DateSelector>
            <LeftArrowOn onClick={onClickDecreaseMonth} />
            <DateSelectButton type="button" onClick={toggleShowModal}>
              <p>{currentDate}</p>
            </DateSelectButton>
            {currentDate === todayDate ? (
              <RightArrowOff />
            ) : (
              <RightArrowOn onClick={onClickIncreaseMonth} />
            )}
          </DateSelector>
        </Diary>
        <div>
          {filteredRecords.length > 0 ? (
            filteredRecords.map((record) => {
              return (
                <Post
                  key={record.id}
                  id={record.id}
                  title={record.title}
                  desc={record.content}
                  day={record.day}
                  emojis={record.emojis}
                  bookmarks={record.bookmarks}
                  background={record.background}
                  image={record.image}
                  user={user.username}
                />
              );
            })
          ) : (
            <EmptyLogMessage>
              <p className="message">아직 내 로그가 없어요</p>
            </EmptyLogMessage>
          )}
          {}
        </div>
      </Main>
      <WriteButton onClick={(e) => onClickWrite(e)}>
        <Posting />
      </WriteButton>
      {showModal && (
        <ModalPortal>
          <DateSelectModal
            dates={dates}
            onClose={toggleShowModal}
            setDate={setCurrentDate}
          />
        </ModalPortal>
      )}
    </Container>
  );
};

export default User;

const Container = styled.div`
  display: flex;
  justify-content: center;
`;

const Main = styled.div`
  min-width: 414px;
  font-family: "Pretendard";
  background-color: #1c1e21;
  min-height: 100vh;
`;

const Diary = styled.div`
  width: 80%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const EmptyLogMessage = styled.div`
  width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  p {
    font-size: 16px;
    font-weight: 300;
    color: rgba(255, 255, 255, 0.65);
  }
`;
const DateSelector = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;
`;

const DateSelectButton = styled.button`
  width: 160px;

  p {
    margin-top: 0.4rem;
    font-family: "Pretendard";
    font-weight: 700;
    font-size: 24px;
    color: #ffffffb7;
  }
`;

const Avatar = styled.img`
  width: 70px;
  border-radius: 100%;
  border: 3px solid #1c1e21;
  pointer-events: none;
  user-select: none;
`;

const AvatarContainer = styled.div`
  width: 85px;
  height: 85px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2.5px solid transparent;
  border-radius: 50%;
  /* background-image: linear-gradient(#fff, #fff), */
  /* linear-gradient(97deg, rgba(244, 172, 64, 1) 35%, rgba(85, 75, 79, 1) 73%); */
  background-origin: border-box;
  background-clip: content-box, border-box;
`;

const WriteButton = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%); /* 가로 중앙 정렬을 위한 변환 */
  display: inline-flex;
  width: 48px;
  height: 48px;
  padding: 10px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 999px;
  background: var(--theme-primary, #f4ac40);
  /* shadow */
  box-shadow: 0px 4px 10px 0px rgba(28, 30, 33, 0.8);
  cursor: pointer;
  box-sizing: content-box;
  z-index: 10;
`;

function Post(props) {
  const urlRegex =
    /[-a-zA-Z0-9@:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_.~#?&//=]*)?/gi;
  return (
    <a href={"/detail/" + props.id} style={{ userSelect: "none" }}>
      <PostBackGround
        $background={
          !props.background.match(urlRegex) ? props.background : "#000000"
        }
      >
        {/* {props.background.match(urlRegex) ? ( */}
        {props.image.length > 0 ? <PostBackImage image={props.image} /> : <></>}
        <PostTitleContainer>
          <div style={{ zIndex: 2 }}>
            <Title>
              {props.title.length > 8
                ? props.title.substr(0, 8) + "..."
                : props.title}
            </Title>
            <Desc>
              {props.desc.length > 20
                ? props.desc.substr(0, 20) + "..."
                : props.desc}
            </Desc>
          </div>
          <CreationDate>{props.day}</CreationDate>
        </PostTitleContainer>
        <PostInfoContainer>
          <StickerMain>
            <StickerContainer>
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  marginRight: "5px",
                }}
              >
                <path
                  d="M17.9784 7.81447C17.7522 6.14742 17.0647 4.57673 15.9935 3.27948C14.9223 1.98223 13.5101 1.01002 11.9159 0.472441C10.3218 -0.0651327 8.60918 -0.146686 6.97117 0.236976C5.33317 0.620638 3.83491 1.45426 2.64531 2.64385C1.45572 3.83344 0.622103 5.3317 0.238441 6.96971C-0.145221 8.60772 -0.0636679 10.3203 0.473906 11.9145C1.01148 13.5086 1.9837 14.9209 3.28094 15.992C4.57819 17.0632 6.14888 17.7507 7.81594 17.977C7.93754 17.9928 8.06005 18.0008 8.18269 18.001C8.97369 17.9944 9.72999 17.6752 10.2864 17.113L17.1114 10.288C17.4354 9.96941 17.6821 9.58079 17.8324 9.15198C17.9827 8.72317 18.0327 8.26561 17.9784 7.81447ZM1.55344 8.16997C1.75515 6.39002 2.58519 4.74039 3.89434 3.51766C5.20348 2.29493 6.90585 1.57928 8.69542 1.49939C10.485 1.41949 12.2444 1.98058 13.6573 3.08178C15.0702 4.18298 16.0439 5.75208 16.4034 7.50697C14.0542 7.53535 11.8091 8.48079 10.1472 10.1415C8.48536 11.8023 7.5384 14.0467 7.50844 16.396C5.66358 16.0239 4.02635 14.9711 2.92239 13.4469C1.81843 11.9227 1.32864 10.0388 1.55044 8.16997H1.55344ZM9.22819 16.0517C9.16356 16.1137 9.09381 16.1702 9.01969 16.2205C9.09251 14.3329 9.87491 12.5424 11.2105 11.2066C12.5462 9.87083 14.3366 9.08824 16.2242 9.01522C16.1744 9.08975 16.1182 9.15977 16.0562 9.22447L9.22819 16.0517Z"
                  fill="#EDEDED"
                />
              </svg>
              <PostInfoText
                style={{
                  fontSize: "13px",
                }}
              >
                {props.emojis}
              </PostInfoText>
            </StickerContainer>
            <StickerContainer>
              <svg
                width="16"
                height="18"
                viewBox="0 0 16 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  marginRight: "5px",
                }}
              >
                <path
                  d="M13.9177 17.9974C13.6487 17.9966 13.3825 17.9409 13.1344 17.8334C12.8864 17.726 12.6615 17.5689 12.4727 17.3712L7.99999 12.7864L3.52732 17.3742C3.24007 17.6747 2.87168 17.879 2.47018 17.9605C2.06868 18.042 1.65269 17.9968 1.27644 17.8309C0.896454 17.6733 0.571389 17.4012 0.343692 17.0502C0.115994 16.6992 -0.00375214 16.2855 8.96253e-05 15.8632V3.74946C8.96253e-05 2.75504 0.383201 1.80135 1.06514 1.09819C1.74709 0.395031 2.672 0 3.63641 0L12.3636 0C12.8411 0 13.314 0.0969826 13.7551 0.28541C14.1963 0.473838 14.5972 0.750021 14.9348 1.09819C15.2725 1.44636 15.5404 1.8597 15.7231 2.3146C15.9058 2.76951 15.9999 3.25707 15.9999 3.74946V15.8632C16.004 16.2851 15.8847 16.6986 15.6575 17.0496C15.4303 17.4006 15.1059 17.6728 14.7265 17.8309C14.4703 17.9414 14.1954 17.998 13.9177 17.9974ZM3.63641 1.49978C3.05776 1.49978 2.50282 1.7368 2.09365 2.1587C1.68448 2.58059 1.45462 3.15281 1.45462 3.74946V15.8632C1.45436 15.9882 1.49001 16.1104 1.55709 16.2145C1.62417 16.3185 1.71965 16.3998 1.83148 16.4479C1.94331 16.4961 2.06647 16.509 2.1854 16.485C2.30434 16.461 2.4137 16.4012 2.4997 16.3131L7.49091 11.1981C7.62717 11.0585 7.8115 10.9801 8.00363 10.9801C8.19576 10.9801 8.38009 11.0585 8.51635 11.1981L13.5017 16.3116C13.5877 16.3997 13.6971 16.4595 13.816 16.4835C13.935 16.5075 14.0581 16.4946 14.17 16.4464C14.2818 16.3983 14.3773 16.317 14.4444 16.213C14.5114 16.1089 14.5471 15.9867 14.5468 15.8617V3.74946C14.5468 3.15281 14.317 2.58059 13.9078 2.1587C13.4986 1.7368 12.9437 1.49978 12.365 1.49978H3.63641Z"
                  fill="#EDEDED"
                />
              </svg>
              <PostInfoText
                style={{
                  fontSize: "13px",
                }}
              >
                {props.bookmarks}
              </PostInfoText>
            </StickerContainer>
          </StickerMain>
          <PostInfoText
            style={{
              marginTop: "5px",
              fontSize: "13px",
            }}
          >
            By {props.user}
          </PostInfoText>
        </PostInfoContainer>
      </PostBackGround>
    </a>
  );
}

const PostBackGround = styled.div`
  position: relative;
  width: 85%;
  height: 180px;
  background-color: ${(props) => props.$background};
  overflow: hidden;
  background-size: cover;
  margin: 0 auto;
  color: white;
  padding: 25px 25px;
  border-radius: 20px;
  margin-bottom: 20px;
  overflow: hidden;
`;

const PostBackImage = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  background-image: url(${(props) => props.image});
  filter: brightness(50%);
  z-index: 0;
  pointer-events: none;
  user-select: none;
`;

const PostTitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const Desc = styled.p`
  opacity: 80%;
`;

const CreationDate = styled.h3`
  font-weight: bold;
  font-size: 18px;
  background-color: #000000;
  padding: 10px 10px;
  opacity: 50%;
  border-radius: 100%;
`;

const PostInfoContainer = styled.div`
  position: absolute;
  width: 90%;
  height: 20px;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: space-between;
`;

const StickerContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;
`;

const StickerMain = styled.div`
  display: flex;
`;

const PostInfoText = styled.p`
  font-weight: 400;
  opacity: 70%;
`;
