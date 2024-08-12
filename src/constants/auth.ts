export const MODAL_MESSAGES = '작성을 중단할까요?';

//비밀번호 관련 메시지와 플레이스홀더
export const PASSWORD = {
  //확인 메시지
  CONFIRMED: '기존 비밀번호가 확인되었습니다.', // 기존 비밀번호 확인 문구
  MISMATCH: '비밀번호가 일치하지 않아요', // 기존 비밀번호, 새 비밀번호 2개 불일치때 나오는 문구
  MATCH: '비밀번호가 일치해요.', // 새 비밀번호 일치일때 나오는 문구
  RULE: '영문/숫자/특수문자 혼합(10자 이상)', // 기본 조건

  //알럿 문구
  SUCCESS: '비밀번호가 변경되었어요.', // 비밀번호 수정 성공
  FAILURE: '비밀번호 변경에 실패했습니다.', // 수정

  // placeholder text
  PASSWORD_EDIT_PLACEHOLDER: '비밀번호를 입력해 주세요.', // 인풋 자리표시
  CONFIRM_PASSWORD_EDIT_PLACEHOLDER: '비밀번호를 한 번 더 입력해 주세요' // 인풋 자리표시
};

// 닉네임 관련 메시지와 플레이스홀더
export const NICKNAME = {
  // 숫자
  MIN_LENGTH: 2,
  MAX_LENGTH: 12,

  // 메시지
  MISMATCH: '사용이 불가능한 닉네임이에요.', //조건 불일치때 나오는 문구
  MATCH: '사용이 가능한 닉네임이에요.', //조건 일치때 나오는 문구
  RULE: '2~12자 이하만 가능해요', // 기본조건

  // //알럿 문구
  SUCCESS: '닉네임이 변경되었습니다.', // 닉네임 수정 성공
  FAILURE: '닉네임 변경에 실패했습니다.', //수정

  // placeholder text
  NICKNAME_EDIT_PLACEHOLDER: '변경할 닉네임을 입력하세요.' // 인풋 자리표시
};

// 자기소개 관련 메시지와 플레이스홀더
export const INFO = {
  // 숫자
  MAX_LINES: 5,
  MAX_LENGTH: 150,

  // 메시지
  MISMATCH: '글자수를 초과했어요!', //조건 불일치때 나오는 문구
  RULE: '150자 이하', // 기본조건

  // //알럿 문구
  SUCCESS: '자기 소개가 변경되었습니다.', // 자기소개 수정 성공
  FAILURE: '자기 소개 변경에 실패했습니다.', //수정

  // placeholder text
  INFO_EDIT_PLACEHOLDER: '자신을 소개해보세요.' // 인풋 자리표시
};

export const IMAGE = {
  // 수정 프로필 이미지 파일 변경되었습니다 알럿 문구
};
