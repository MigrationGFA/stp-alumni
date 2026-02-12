"use client";
import { NetworkStats } from "./(components)/NetworkStats";

const NetworkLayout = ({ children }) => {


  return (
    <section>
      <div className="space-y-6 p-3 sm:p-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-stp-blue-light">
            Networking
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3">
            <NetworkStats />
          </div>

          <div className="lg:col-span-9 space-y-6">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NetworkLayout;