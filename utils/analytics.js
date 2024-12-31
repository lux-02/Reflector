// 페이지 조회수 추적
export const pageview = (url) => {
  if (typeof window.gtag !== "undefined") {
    window.gtag("config", process.env.NEXT_PUBLIC_GA_ID, {
      page_path: url,
    });
  }
};

// 사용자 이벤트 추적
export const event = ({ action, category, label, value }) => {
  if (typeof window.gtag !== "undefined") {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// 사용자 속성 설정
export const setUserProperties = (properties) => {
  if (typeof window.gtag !== "undefined") {
    window.gtag("set", "user_properties", properties);
  }
};

// 주요 이벤트 상수
export const ANALYTICS_EVENTS = {
  // 로그인 관련
  LOGIN: {
    action: "login",
    category: "authentication",
  },
  LOGIN_ERROR: {
    action: "login_error",
    category: "authentication",
  },

  // 질문 관련
  VIEW_QUESTION: {
    action: "view_question",
    category: "engagement",
  },
  ANSWER_QUESTION: {
    action: "answer_question",
    category: "engagement",
  },

  // 카테고리 관련
  CHANGE_CATEGORY: {
    action: "change_category",
    category: "navigation",
  },

  // 언어 관련
  CHANGE_LANGUAGE: {
    action: "change_language",
    category: "preferences",
  },
};
