module.exports = {
  images: {
    domains: ["res.cloudinary.com"],
  },
  async rewrites() {
    return [
      {
        source: "/api/graphql",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://localhost:3000/api/graphql"
            : "https://augury-backend.herokuapp.com/api/graphql",
      },
    ];
  },
};
