const defaultProject = {
  __v: 0,
  createdAt: 0,
  updatedAt: 0,
  deviceType: 0,
  password: 0,
  isDeleted: 0,
  isBlocked: 0,
  favArtists: 0,
  // location: 0,
};

exports.User = {
  default: { ...defaultProject },
  login: {
    createdAt: 0,
    updatedAt: 0,
    deviceType: 0,
    isDeleted: 0,
    isBlocked: 0,
    location: 0,
    __v: 0,
  },
};

