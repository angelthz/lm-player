export default function SplashScreen() {

    return (
        <div className="w-full h-dvh bg-black fixed top-0 left-0 z-90 welcome">
            <div id="welcome" className="
                bg-transparent
                w-[100px]
                h-[100px]
                absolute
                top-[50%] left-[50%] 
                opacity-0
                -translate-x-[50%]
                -translate-y-[50%]
                animate-splash-screen
                z-depth-4"
            >
                <svg fill="white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <rect x="1" y="6" width="2.8" height="12">
                        <animate begin="spinner_Diec.begin+0.4s" attributeName="y" calcMode="spline" dur="0.4s" values="6;1;6" keySplines=".14,.73,.34,1;.65,.26,.82,.45" />
                        <animate begin="spinner_Diec.begin+0.4s" attributeName="height" calcMode="spline" dur="0.4s" values="12;22;12" keySplines=".14,.73,.34,1;.65,.26,.82,.45" />
                    </rect><rect x="5.8" y="6" width="2.8" height="12">
                        <animate begin="spinner_Diec.begin+0.2s" attributeName="y" calcMode="spline" dur="0.4s" values="6;1;6" keySplines=".14,.73,.34,1;.65,.26,.82,.45" />
                        <animate begin="spinner_Diec.begin+0.2s" attributeName="height" calcMode="spline" dur="0.4s" values="12;22;12" keySplines=".14,.73,.34,1;.65,.26,.82,.45" />
                    </rect><rect x="10.6" y="6" width="2.8" height="12">
                        <animate id="spinner_Diec" begin="0;spinner_dm8s.end-0.1s" attributeName="y" calcMode="spline" dur="0.4s" values="6;1;6" keySplines=".14,.73,.34,1;.65,.26,.82,.45" />
                        <animate begin="0;spinner_dm8s.end-0.1s" attributeName="height" calcMode="spline" dur="0.4s" values="12;22;12" keySplines=".14,.73,.34,1;.65,.26,.82,.45" />
                    </rect><rect x="15.4" y="6" width="2.8" height="12">
                        <animate begin="spinner_Diec.begin+0.2s" attributeName="y" calcMode="spline" dur="0.4s" values="6;1;6" keySplines=".14,.73,.34,1;.65,.26,.82,.45" />
                        <animate begin="spinner_Diec.begin+0.2s" attributeName="height" calcMode="spline" dur="0.4s" values="12;22;12" keySplines=".14,.73,.34,1;.65,.26,.82,.45" />
                    </rect><rect x="20.2" y="6" width="2.8" height="12">
                        <animate id="spinner_dm8s" begin="spinner_Diec.begin+0.4s" attributeName="y" calcMode="spline" dur="0.4s" values="6;1;6" keySplines=".14,.73,.34,1;.65,.26,.82,.45" />
                        <animate begin="spinner_Diec.begin+0.4s" attributeName="height" calcMode="spline" dur="0.4s" values="12;22;12" keySplines=".14,.73,.34,1;.65,.26,.82,.45" />
                    </rect>
                </svg>
            </div>
        </div>
    )
}