import React from "react";
import ContentWrapper from "../../components/ContentWrapper/ContentWrapper";

function Dashboard() {
  return (
    <ContentWrapper>
      <div className="h-screen flex flex-col justify-center bg-white items-center">
        <span className="text-9xl font-bold text-gray-700">200</span>
        <span className="text-4xl text-gray-700">Admin Dashboard</span>
      </div>
    </ContentWrapper>
  );
}

export default Dashboard;
