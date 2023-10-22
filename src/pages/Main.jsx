import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import Header from "../components/Header";
import BookMark from "../components/BookMark";
import { ReactComponent as Emoji } from "../assets/emoji.svg";
import { ReactComponent as Posting } from "../assets/posting.svg";

const Main = () => {
  const navigate = useNavigate();

  const [records, setRecords] = useState([]);
  const [tab, setTab] = useState("모든로그");

  // console.log();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/record/getAll"
        );
        const data = response.data;
        console.log("records", data);
        setRecords(data);
      } catch (error) {
        console.error("API 호출 오류:", error);
      }
    };

    fetchData();
  }, []);

  const handleTabClick = (newTab) => {
    setTab(newTab);
  };

  return (
    <BackGround>
      <Header />
      <Container>
        {/* MenuTab */}
        <Menu>
          <MenuItem
            selected={tab === "모든로그"}
            onClick={() => handleTabClick("모든로그")}
          >
            모든로그
          </MenuItem>
          <MenuItem
            selected={tab === "북마크"}
            onClick={() => handleTabClick("북마크")}
          >
            북마크
          </MenuItem>
        </Menu>

        {/* Logs */}
        <Contents>
          {records.map((record, i) => (
            <Card
              key={`record-${i}`}
              image={record?.image}
              background={record.background}
              onClick={() => navigate(`/detail/${record.id}`)}
            >
              <Cover>
                <BarWrapper>
                  <Bar>
                    <BookMark isMarked={record.isMarked} />
                  </Bar>
                </BarWrapper>
                <Content>
                  <TextWrapper>
                    <Record>
                      <RecordTitle>{record.title}</RecordTitle>
                      <RecordContent>{record.content}</RecordContent>
                    </Record>
                    <SmallText>{record.created_at}</SmallText>
                  </TextWrapper>
                </Content>
                <BarWrapper>
                  <BottomBar>
                    <EmojiContainer>
                      <Emoji />
                      <SmallText>{record.emojiCount}</SmallText>
                    </EmojiContainer>

                    <SmallText>by {record.writer}</SmallText>
                  </BottomBar>
                </BarWrapper>
              </Cover>
            </Card>
          ))}
        </Contents>

        {/* 글작성 버튼 */}
        <WriteButton>
          <Posting />
        </WriteButton>
      </Container>
    </BackGround>
  );
};

export default Main;

const BackGround = styled.div`
  width: 100vw;
  min-height: 100vh;
  background-color: #1c1e21;
  padding-top: 100px;
`;

const Container = styled.div`
  width: 100%;
`;

const Menu = styled.div`
  display: flex;
  width: 100vw;
  padding: 0px 20px;
`;

const MenuItem = styled.button`
  display: flex;
  padding: 8px 0px;
  justify-content: center;
  align-items: center;
  gap: 2px;
  flex: 1 0 0;
  color: ${(props) =>
    props.selected ? "rgba(255, 255, 255, 0.95)" : "rgba(255, 255, 255, 0.25)"};
  border-bottom: ${(props) => (props.selected ? "2px solid #ffffff" : "none")};
  transition: color 0.3s, border-bottom 0.3s;
`;

const Contents = styled.div`
  display: flex;
  padding: 20px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

const Card = styled.div`
  display: flex;
  width: 320px;
  height: 520px;
  align-items: flex-start;
  ${(props) =>
    props.image
      ? `background-image: url(${props.image});`
      : `background-color: ${props.background};`}
  background-size: cover;
  color: white;
  border-radius: 16px;
`;

const Cover = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  border-radius: 16px;
`;

const BarWrapper = styled.div`
  display: flex;
  padding: 16px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 48px;
`;

const Bar = styled.div`
  display: flex;
  width: 288px;
  padding-left: 0px;
  justify-content: flex-end;
  align-items: center;
`;

const Content = styled.div`
  display: flex;
  width: 320px;
  padding: 0px 38px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 48px;
  flex: 1 0 0;
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 48px;
  align-self: stretch;
  width: 244px;
`;

const Record = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const RecordTitle = styled.div`
  font-family: Pretendard;
  font-size: 22px;
  font-style: normal;
  font-weight: 700;
  line-height: 125%; /* 27.5px */
  letter-spacing: -0.3px;
  width: 244px;
  text-align: center;
  overflow: hidden; /* 넘치는 내용 숨김 */
  text-overflow: ellipsis; /* 생략 부호 표시 */
  white-space: nowrap;
`;

const RecordContent = styled.div`
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 160%; /* 25.6px */
  letter-spacing: -0.2px;
  overflow: hidden; /* 넘치는 내용 숨김 */
  text-overflow: ellipsis; /* 생략 부호 표시 */
  white-space: nowrap;
  text-align: center;
  width: 244px;
  height: 50px;
`;

const SmallText = styled.span`
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 300;
  line-height: 160%; /* 22.4px */
  letter-spacing: -0.2px;
`;

const EmojiContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  cursor: pointer;
`;

const BottomBar = styled.div`
  display: flex;
  width: 288px;
  justify-content: space-between;
`;

const WriteButton = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%); /* 가로 중앙 정렬을 위한 변환 */
  display: inline-flex;
  padding: 10px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 999px;
  background: var(--theme-primary, #f4ac40);
  /* shadow */
  box-shadow: 0px 4px 10px 0px rgba(28, 30, 33, 0.8);
  cursor: pointer;
`;

const currentDate = new Date();
const createdAt = currentDate.toISOString();
