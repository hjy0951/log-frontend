import React from "react";
import styled from "styled-components";
import { ReactComponent as More } from "../../assets/More.svg";
import { ReactComponent as Back } from "../../assets/Back.svg";

const ChangedHeader = ({ type }) => {
  return (
    <Header>
      <Container>
        <div>
          <button>
            <Back />
          </button>
        </div>
        <div>
          {type === "input" ? (
            <>
              <button>사진추가</button>
              <button>발행!</button>
            </>
          ) : (
            <button>
              <More />
            </button>
          )}
        </div>
      </Container>
    </Header>
  );
};

export default ChangedHeader;

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  width: 100dvw;
  padding: 2.5rem 1.5rem;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const Container = styled.div`
  padding: 1rem 1%;
  width: 100%;
  max-width: 80rem;
  display: flex;
  justify-content: space-between;
  /* align-items: center; */
`;
