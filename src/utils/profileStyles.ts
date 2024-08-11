type GetStylesParams = {
  allConditionsMet: boolean;
  isConditionNotMet: boolean;
  isConditionMet: boolean;
};

export const getStyles = ({ allConditionsMet, isConditionNotMet, isConditionMet }: GetStylesParams) => {
  //조건설정 기준: 인풋 포서스 끝나고 모든 조건을 충족했을때
  if (allConditionsMet) {
    return {
      titleTextColor: 'text-neutral-900',
      conditionTextColor: 'text-main-400',
      stroke: '#423edf',
      borderColor: 'text-neutral-900 outline-neutral-300 border border-neutral-300'
    };
  }

  //조건설정 기준: 인풋 포서스중 조건이 불충족했을떄
  if (isConditionNotMet) {
    return {
      titleTextColor: 'text-red',
      conditionTextColor: 'text-red',
      stroke: '#F66161',
      borderColor: 'text-red outline-red border border-red'
    };
  }

  //조건설정 기준: 인풋 포서스중 조건이 충족했을때
  if (isConditionMet) {
    return {
      titleTextColor: 'text-main-400',
      conditionTextColor: 'text-main-400',
      stroke: '#423edf',
      borderColor: 'text-neutral-900 outline-main-400 border border-main-400'
    };
  }

  //조건설정 기준: 포서스와 상관없이 입력란 공란
  return {
    titleTextColor: 'text-neutral-300',
    conditionTextColor: 'text-neutral-300',
    stroke: '#A8A8A8',
    borderColor: 'text-neutral-300 outline-neutral-300 border border-neutral-300'
  };
};
