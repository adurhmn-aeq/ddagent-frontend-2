import { useEffect, useState } from "react";
import Sidebar from "@/app/sidebar";
import { getUserCompanyDetails } from "@/utils/company";
import Cookies from "universal-cookie";
import { createBilling, createCustomer, createSubscription } from "@/utils/subscription";

interface UserData {
    firstname: string
    lastname: string
    email: string
    userId: string
}

function Plans() {
    const cookies = new Cookies();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [companyData, setCompanyData] = useState<any | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        const fetchUserData = async () => {
            setLoading(true);
            const companyDetails = cookies.get("userdata");
            if (companyDetails) {
                setUserData(companyDetails);
            }
        };

        fetchUserData();
    }, [])

    useEffect(() => {
        if (userData) {
            const userToken = cookies.get('token')
            // Perform actions that depend on companyData here
            getUserCompanyDetails(userData.userId, userToken).then((res) => {
                setCompanyData(res[0]);
            })
            setLoading(false); // Set loading to false after data is available
        }
    }, [userData]);

    useEffect(() => {
        if (companyData) {
            // Perform actions that depend on companyData here
            setLoading(false); // Set loading to false after data is available
        }
    }, [companyData]);

    const handleSubscription = (product: string) => {
        setLoading(true)
        if (companyData && companyData.subscriptionId != null) {
            if (userData) {
                const userToken = cookies.get('token')
                createSubscription(product, companyData.subscriptionId, userToken).then((res) => {
                    setLoading(false)
                    window.location.replace(res.url)
                })
            }
        } else {
            if (userData && companyData && companyData.subscriptionId === null) {
                const userToken = cookies.get('token')
                createCustomer(userData.userId, userToken).then((res: { id: string }) => {
                    console.log(res)
                    const userToken = cookies.get('token')
                    createSubscription(product, res.id, userToken).then((res) => {
                        setLoading(false)
                        window.location.replace(res.url)
                    })
                })
            }
        }
    }

    const handleUpgrade = () => {
        setLoading(true)
        const userToken = cookies.get('token')
        if (userData && companyData) {
            createBilling(companyData.subscriptionId, userToken).then((res) => {
                setLoading(false)
                window.location.replace(res.url)
            })
        }
    }

    return (
        <Sidebar>
            {!loading &&
                <section className="flex flex-col justify-center antialiased bg-gray-100 text-gray-600 min-h-screen ms-40">
                    <div className="h-full">
                        <div className="max-w-5xl mx-auto mb-10 mt-20">
                            <h2 className="text-md text-gray-800 font-bold text-left ms-2 mb-3">My Current Plan</h2>
                            <div className="block max-w-sm p-6 bg-grey border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">450
                                    <p className="font-normal text-gray-400 dark:text-gray-400">mins left</p>
                                </h5>
                                <button
                                    disabled={companyData && companyData.plan === "none"}
                                    onClick={handleUpgrade}
                                    className="font-medium text-sm inline-flex items-center justify-center px-3 py-2 border border-transparent rounded leading-5 shadow-sm transition duration-150 ease-in-out bg-green-600 focus:outline-none focus-visible:ring-2 hover:bg-red-600 text-white w-full disabled:bg-neutral-300">Cancel Subscription</button>
                            </div>
                        </div>

                        <div className="max-w-5xl mx-auto mb-20" x-data="{ annual: true }">
                            <h2 className="text-3xl text-gray-800 font-bold text-center mb-4">Plans</h2>
                            <div className="grid grid-cols-12 gap-6">

                                <div className="relative col-span-full md:col-span-4 bg-grey shadow-md rounded-sm border border-gray-200">
                                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-green-500" aria-hidden="true"></div>
                                    <div className="px-5 pt-5 pb-6 border-b border-gray-200">
                                        <header className="flex items-center mb-2">
                                            <div className="w-6 h-6 rounded-full flex-shrink-0 bg-gradient-to-tr from-green-500 to-green-300 mr-3">
                                                <svg className="w-6 h-6 fill-current text-white" viewBox="0 0 24 24">
                                                    <path d="M12 17a.833.833 0 01-.833-.833 3.333 3.333 0 00-3.334-3.334.833.833 0 110-1.666 3.333 3.333 0 003.334-3.334.833.833 0 111.666 0 3.333 3.333 0 003.334 3.334.833.833 0 110 1.666 3.333 3.333 0 00-3.334 3.334c0 .46-.373.833-.833.833z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-lg text-gray-800 font-semibold">Basic Plan</h3>
                                        </header>
                                        <div className="text-sm mb-2">Small businesses and startups</div>

                                        <div className="text-gray-800 font-bold mb-4">
                                            <span className="text-2xl">$279 / month</span>
                                        </div>
                                        {companyData && companyData.plan === "standard" ?
                                            <button className="font-medium text-sm inline-flex items-center justify-center px-3 py-2 border border-transparent rounded leading-5 shadow-sm transition duration-150 ease-in-out border-gray-200 focus:outline-none focus-visible:ring-2 bg-gray-100 text-gray-400 w-full cursor-not-allowed" disabled>
                                                <svg className="w-3 h-3 flex-shrink-0 fill-current mr-2" viewBox="0 0 12 12">
                                                    <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                                </svg>
                                                <span>Current Plan</span>
                                            </button>
                                            : companyData && companyData.plan === "premium" ?
                                                <button
                                                    onClick={handleUpgrade}
                                                    className="font-medium text-sm inline-flex items-center justify-center px-3 py-2 border border-gray-200 rounded leading-5 shadow-sm transition duration-150 ease-in-out focus:outline-none focus-visible:ring-2 hover:border-gray-300 text-gray-600 w-full">{loading ? 'Loading...' : 'Downgrade'}</button>
                                                :
                                                <button
                                                    onClick={() => handleSubscription("standard")}
                                                    disabled={loading}
                                                    className="font-medium text-sm inline-flex items-center justify-center px-3 py-2 border border-gray-200 rounded leading-5 shadow-sm transition duration-150 ease-in-out focus:outline-none focus-visible:ring-2 hover:border-gray-300 hover:bg-green-500 hover:text-white text-gray-600 w-full disabled:bg-gray-100">{loading ? 'Loading...' : 'Buy Plan'}</button>
                                        }
                                        {/* <button className="font-medium text-sm inline-flex items-center justify-center px-3 py-2 border border-gray-200 rounded leading-5 shadow-sm transition duration-150 ease-in-out focus:outline-none focus-visible:ring-2 hover:border-gray-300 text-gray-600 w-full">Downgrade</button> */}
                                    </div>
                                    <div className="px-5 pt-4 pb-5">
                                        <div className="text-xs text-gray-800 font-semibold uppercase mb-4">What's included</div>

                                        <ul>
                                            <li className="flex items-center py-1">
                                                <svg className="w-3 h-3 flex-shrink-0 fill-current text-green-500 mr-2" viewBox="0 0 12 12">
                                                    <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                                </svg>
                                                <div className="text-sm">200 minutes per month.</div>
                                            </li>
                                            <li className="flex items-center py-1">
                                                <svg className="w-3 h-3 flex-shrink-0 fill-current text-green-500 mr-2" viewBox="0 0 12 12">
                                                    <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                                </svg>
                                                <div className="text-sm">Additional usage billed at $0.30 per minute.</div>
                                            </li>
                                            <li className="flex items-center py-1">
                                                <svg className="w-3 h-3 flex-shrink-0 fill-current text-green-500 mr-2" viewBox="0 0 12 12">
                                                    <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                                </svg>
                                                <div className="text-sm">Personal workspace</div>                          </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="relative col-span-full md:col-span-4 bg-white shadow-md rounded-sm border border-gray-200">
                                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500" aria-hidden="true"></div>
                                    <div className="px-5 pt-5 pb-6 border-b border-gray-200">
                                        <header className="flex items-center mb-2">
                                            <div className="w-6 h-6 rounded-full flex-shrink-0 bg-gradient-to-tr from-green-500 to-green-300 mr-3">
                                                <svg className="w-6 h-6 fill-current text-white" viewBox="0 0 24 24">
                                                    <path d="M12 17a.833.833 0 01-.833-.833 3.333 3.333 0 00-3.334-3.334.833.833 0 110-1.666 3.333 3.333 0 003.334-3.334.833.833 0 111.666 0 3.333 3.333 0 003.334 3.334.833.833 0 110 1.666 3.333 3.333 0 00-3.334 3.334c0 .46-.373.833-.833.833z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-lg text-gray-800 font-semibold">Standard Team Plan</h3>
                                        </header>
                                        <div className="text-sm mb-2">Mid-market companies</div>

                                        {/* <div className="text-gray-800 font-bold mb-4">
                                            <span className="text-2xl">$479 / month</span>
                                        </div> */}
                                        <div className="text-gray-800 font-bold mb-4">
                                                <span className="text-2xl">$</span><span className="text-3xl" x-text="annual ? '74' : '79'">479</span><span className="text-gray-500 font-medium text-sm">/mo</span>
                                            </div>
                                        {companyData && companyData.plan === "standard" ?
                                            <button
                                                onClick={handleUpgrade}
                                                className="font-medium text-sm inline-flex items-center justify-center px-3 py-2 border border-transparent rounded leading-5 shadow-sm transition duration-150 ease-in-out bg-green-500 focus:outline-none focus-visible:ring-2 hover:bg-green-600 text-white w-full">{loading ? 'Loading...' : 'Upgrade'}</button>
                                            : companyData && companyData.plan === "premium" ?
                                                <button className="font-medium text-sm inline-flex items-center justify-center px-3 py-2 border border-transparent rounded leading-5 shadow-sm transition duration-150 ease-in-out border-gray-200 focus:outline-none focus-visible:ring-2 bg-gray-100 text-gray-400 w-full cursor-not-allowed" disabled>
                                                    <svg className="w-3 h-3 flex-shrink-0 fill-current mr-2" viewBox="0 0 12 12">
                                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                                    </svg>
                                                    <span>Current Plan</span>
                                                </button>
                                                :
                                                <button
                                                    onClick={() => handleSubscription("premium")}
                                                    disabled={loading}
                                                    className="font-medium text-sm inline-flex items-center justify-center px-3 py-2 border border-gray-200 rounded leading-5 shadow-sm transition duration-150 ease-in-out focus:outline-none focus-visible:ring-2 hover:border-gray-300 hover:bg-green-500 hover:text-white text-gray-600 w-full disabled:bg-gray-100">{loading ? 'Loading...' : 'Buy Plan'}</button>
                                        }
                                    </div>
                                    <div className="px-5 pt-4 pb-5">
                                        <div className="text-xs text-gray-800 font-semibold uppercase mb-4">What's included</div>

                                        <ul>
                                            <li className="flex items-center py-1">
                                                <svg className="w-3 h-3 flex-shrink-0 fill-current text-green-500 mr-2" viewBox="0 0 12 12">
                                                    <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                                </svg>
                                                <div className="text-sm">500 minutes per month </div>
                                            </li>
                                            <li className="flex items-center py-1">
                                                <svg className="w-3 h-3 flex-shrink-0 fill-current text-green-500 mr-2" viewBox="0 0 12 12">
                                                    <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                                </svg>
                                                <div className="text-sm">Enhanced team reporting</div>
                                            </li>
                                            <li className="flex items-center py-1">
                                                <svg className="w-3 h-3 flex-shrink-0 fill-current text-green-500 mr-2" viewBox="0 0 12 12">
                                                    <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                                </svg>
                                                <div className="text-sm">Advanced AI feedback</div>
                                            </li>                                            
                                            <li className="flex items-center py-1">
                                                <svg className="w-3 h-3 flex-shrink-0 fill-current text-green-500 mr-2" viewBox="0 0 12 12">
                                                    <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                                </svg>
                                                <div className="text-sm">Live chat support</div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="relative col-span-full md:col-span-4 bg-grey shadow-md rounded-sm border border-gray-200">
                                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-green-500" aria-hidden="true"></div>
                                    <div className="px-5 pt-5 pb-6 border-b border-gray-200">
                                        <header className="flex items-center mb-2">
                                            <div className="w-6 h-6 rounded-full flex-shrink-0 bg-gradient-to-tr from-green-500 to-green-300 mr-3">
                                                <svg className="w-6 h-6 fill-current text-white" viewBox="0 0 24 24">
                                                    <path d="M12 17a.833.833 0 01-.833-.833 3.333 3.333 0 00-3.334-3.334.833.833 0 110-1.666 3.333 3.333 0 003.334-3.334.833.833 0 111.666 0 3.333 3.333 0 003.334 3.334.833.833 0 110 1.666 3.333 3.333 0 00-3.334 3.334c0 .46-.373.833-.833.833z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-lg text-gray-800 font-semibold">Premium Enterprise Plan</h3>
                                        </header>
                                        <div className="text-sm mb-2">Large enterprises and BPOs</div>

                                        <div className="text-gray-800 font-bold mb-4">
                                            <span className="text-2xl">$</span><span className="text-3xl" x-text="annual ? '74' : '79'">4,500</span><span className="text-gray-500 font-medium text-sm">/mo</span>
                                        </div>

                                        <button className="font-medium text-sm inline-flex items-center justify-center px-3 py-2 border border-transparent rounded leading-5 shadow-sm transition duration-150 ease-in-out bg-green-500 focus:outline-none focus-visible:ring-2 hover:bg-green-600 text-white w-full">Upgrade</button>
                                    </div>
                                    <div className="px-5 pt-4 pb-5">
                                        <div className="text-xs text-gray-800 font-semibold uppercase mb-4">What's included</div>

                                        <ul>
                                            <li className="flex items-center py-1">
                                                <svg className="w-3 h-3 flex-shrink-0 fill-current text-green-500 mr-2" viewBox="0 0 12 12">
                                                    <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                                </svg>
                                                <div className="text-sm">6,000 minutes per month</div>
                                            </li>
                                            <li className="flex items-center py-1">
                                                <svg className="w-3 h-3 flex-shrink-0 fill-current text-green-500 mr-2" viewBox="0 0 12 12">
                                                    <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                                </svg>
                                                <div className="text-sm">CRM integrations</div>
                                            </li>
                                            <li className="flex items-center py-1">
                                                <svg className="w-3 h-3 flex-shrink-0 fill-current text-green-500 mr-2" viewBox="0 0 12 12">
                                                    <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                                </svg>
                                                <div className="text-sm">Multilingual training</div>
                                            </li>
                                            <li className="flex items-center py-1">
                                                <svg className="w-3 h-3 flex-shrink-0 fill-current text-green-500 mr-2" viewBox="0 0 12 12">
                                                    <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                                </svg>
                                                <div className="text-sm">Dedicated support</div>
                                            </li>
                                            <li className="flex items-center py-1">
                                                <svg className="w-3 h-3 flex-shrink-0 fill-current text-green-500 mr-2" viewBox="0 0 12 12">
                                                    <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                                </svg>
                                                <div className="text-sm">Quarterly business reviews</div>
                                            </li>

                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>}
        </Sidebar>
    );
}

export default Plans;