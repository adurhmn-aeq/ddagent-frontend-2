import Header from "./header";

function MobileView() {
    return (
        <div className="bg-white">
            <Header />
            <div className="flex items-center flex-col m-auto h-screen max-w-xl text-center mt-20">
                <p className="p-6 text-center">This website cannot be accesed from a mobile phone. Please use a desktop computer to access this website.</p>
            </div>
        </div>
        
      );
}

export default MobileView;