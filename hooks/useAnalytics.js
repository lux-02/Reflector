export const useAnalytics = () => {
  const trackEvent = (action, category, label, value) => {
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({
        event: action,
        eventCategory: category,
        eventLabel: label,
        eventValue: value,
      });
    }
  };

  const trackPageView = (url) => {
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({
        event: "pageview",
        page: url,
      });
    }
  };

  const trackUserEngagement = (userId, action) => {
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({
        event: action,
        eventCategory: "User",
        eventLabel: userId,
        userId: userId,
      });
    }
  };

  const trackAnswerCompletion = (userId, categoryName, questionCount) => {
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({
        event: "answer_completion",
        eventCategory: "Progress",
        eventLabel: categoryName,
        userId: userId,
        questionCount: questionCount,
        categoryName: categoryName,
      });
    }
  };

  return {
    trackEvent,
    trackPageView,
    trackUserEngagement,
    trackAnswerCompletion,
  };
};
