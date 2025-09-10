const getBodyNotifications = (message) => {
  try {
    let templateNotifications = {
      to: message?.to,
    };
    if (message?.notification) {
      templateNotifications.notification = {
        body: message?.notification?.body,
        screen: message?.notification?.screen,
        show_in_foreground: message?.notification?.foreground
          ? message?.notification?.foreground
          : true,
        content_available: true,
        priority: message?.notification?.priority
          ? message?.notification?.priority
          : "high",
        subtitle: message?.notification?.subtitle,
        title: message?.notification?.title,
        icon: message?.notification?.icon,
        click_action: message?.notification?.click_action,
      };
    }
    templateNotifications.data = {
      priority: message?.data?.priority ? message?.data.priority : "high",
      sound: message?.data?.sound ? message?.data?.sound : "app_sound.wav",
      content_available: message?.data?.content_available
        ? message?.data?.content_available
        : true,
      backgroundState: true,
      bodyText: message?.data?.body,
    };
    return templateNotifications;
  } catch (err) {
    console.error(err);
  }
};
module.exports = getBodyNotifications;
