import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  StackActions,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  CheckIcon,
  ChevronRightIcon,
  ClockIcon,
  MapPinIcon,
  XMarkIcon,
} from "react-native-heroicons/outline";
import { useTailwind } from "tailwindcss-react-native";
import useAuth from "../hooks/useAuth";
import useShops from "../hooks/useShops";
import { Divider } from "react-native-paper";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import useOrders from "../hooks/useOrders";

const OrderDetails = () => {
  const tw = useTailwind();
  const navigation = useNavigation();
  const route = useRoute();
  const { url, user } = useAuth();
  const { shops } = useShops();
  const { confirmOrder, updateDeliveryDate, deliverOrder, cancelOrder } =
    useOrders();
  const { order, dateFormat: date, statusColor } = route.params;

  const [customer, setCustomer] = useState();
  const [shop, setShop] = useState(shops.filter((s) => s.id == order.sid)[0]);
  const [items, setItems] = useState([]);
  const [datePickerOpened, setDatePickerOpened] = useState(false);
  const [timePickerOpened, setTimePickerOpened] = useState(false);
  const [expectedDate, setExpectedDate] = useState(
    order.status === "Pending" ? new Date() : new Date(order.expected_date)
  );
  const [expectedTime, setExpectedTime] = useState(
    order.status === "Pending" ? new Date() : new Date(order.expected_date)
  );

  let hours, minutes, dateFormat;

  hours =
    expectedTime.getHours() < 10
      ? "0" + expectedTime.getHours()
      : expectedTime.getHours();
  minutes =
    expectedTime.getMinutes() < 10
      ? "0" + expectedTime.getMinutes()
      : expectedTime.getMinutes();
  dateFormat = expectedDate.toDateString() + ", " + hours + ":" + minutes;

  const getCustomer = async () => {
    try {
      const res = await fetch(url + "/user/" + order.uid, {
        method: "GET",
      });

      const data = await res.json();

      setCustomer(data);
    } catch (e) {
      console.log(e.message);
    }
  };

  const getOrderItems = async () => {
    try {
      const res = await fetch(url + "/orderItems/" + order.id, {
        method: "GET",
      });

      const data = await res.json();

      if (data) {
        setItems(data);
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  const calculateTotal = () => {
    let total = 0;
    items.map((item) => {
      total = total + item.price * item.quantity;
    });

    return total;
  };

  useEffect(() => {
    getCustomer();
    getOrderItems();
  }, []);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Order Details",
      headerStyle: {
        backgroundColor: "#0584F9",
      },
      headerTintColor: "#fff",
    });
  });
  return (
    <View className={"flex-1 bg-white"}>
      {user.id === shop.owner_id && (
        <>
          {order.status === "Pending" && (
            <View className={"flex-row"}>
              <TouchableOpacity
                onPress={() => {
                  confirmOrder(
                    order.id,
                    true,
                    expectedDate,
                    expectedTime,
                    customer.id,
                    user.id,
                    shop.id
                  );
                  const popAction = StackActions.pop(2);
                  navigation.dispatch(popAction);
                }}
                className={
                  "flex-1 flex-row p-3 justify-center items-center border border-gray-300"
                }
              >
                <CheckIcon size={28} style={tw("text-green-500 mr-2")} />
                <Text className={"text-black font-medium"}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  confirmOrder(
                    order.id,
                    false,
                    expectedDate,
                    expectedTime,
                    customer.id,
                    user.id,
                    shop.id
                  );
                  const popAction = StackActions.pop(2);
                  navigation.dispatch(popAction);
                }}
                className={
                  "flex-1 flex-row p-3 justify-center items-center border border-gray-300"
                }
              >
                <XMarkIcon size={28} style={tw("text-red-500 mr-2")} />
                <Text className={"text-black font-medium"}>Decline</Text>
              </TouchableOpacity>
            </View>
          )}
          {order.status === "Ongoing" && (
            <View className={"flex-row"}>
              <TouchableOpacity
                onPress={() => {
                  deliverOrder(order.id, customer.id, shop.id);
                  const popAction = StackActions.pop(2);
                  navigation.dispatch(popAction);
                }}
                className={
                  "flex-1 flex-row p-3 justify-center items-center border border-gray-300"
                }
              >
                <CheckIcon size={28} style={tw("text-green-500 mr-2")} />
                <Text className={"text-black font-medium"}>Delivered</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  cancelOrder(order.id, customer.id, shop.id);
                  const popAction = StackActions.pop(2);
                  navigation.dispatch(popAction);
                }}
                className={
                  "flex-1 flex-row p-3 justify-center items-center border border-gray-300"
                }
              >
                <XMarkIcon size={28} style={tw("text-red-500 mr-2")} />
                <Text className={"text-black font-medium"}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}

      <View className={"flex-1 px-3"}>
        <ScrollView>
          <View className={""}>
            <View className={"flex-row justify-between py-6"}>
              <View className="border border-gray-300 rounded rounded-xl h-20 w-24 p-1">
                <Image
                  source={{ uri: shop.logo }}
                  className="h-full w-full rounded rounded-xl"
                  resizeMode="contain"
                />
              </View>
              <View className="flex-1 ml-6">
                <Text className="text-xl font-semibold mb-0.5">
                  {shop.name}
                </Text>
                <Text
                  style={{ color: statusColor }}
                  className="font-medium mb-0.5"
                >
                  {order.status}
                </Text>
                <Text className="mb-0.5 text-gray-500">{date}</Text>
                <Text className="text-gray-500">Order ID: {order.id}</Text>
              </View>
            </View>

            <Divider />

            <View className={"flex-row py-6"}>
              <MapPinIcon size={30} style={tw("text-black")} />
              <View className={"ml-3"}>
                <Text className={"text-xl font-semibold mb-1"}>
                  Delivery Address
                </Text>
                <Text className={"text-gray-500 mb-1"}>
                  {customer?.first_name + " " + customer?.last_name}
                </Text>
                <Text className={"text-gray-500 mb-1"}>
                  {order.address.area}
                </Text>
                <Text className={"text-gray-500 mb-1"}>
                  {"Block " +
                    order.address.block +
                    ", Road " +
                    order.address.road +
                    ", House/Building " +
                    order.address.building}
                </Text>
                {order.address.flat !== null && (
                  <Text className={"text-gray-500 mb-1"}>
                    {"Flat " + order.address.flat}
                  </Text>
                )}
                <Text className={"text-gray-500 mb-1"}>
                  Mobile number: {customer?.phone_number}
                </Text>
              </View>
            </View>

            <Divider />

            <View className={"py-6"}>
              <Text className={"font-semibold text-xl mb-2"}>
                Order Summary
              </Text>

              {items.map((item, index) => (
                <View className={"flex-1 flex-row mb-2"} key={index}>
                  <Text className={"text-gray-700 mr-3"}>{item.quantity}x</Text>
                  {item.size ? (
                    <>
                      <Text className={"text-gray-700 mr-2"}>{item.name}</Text>
                      <Text className={"flex-1 text-gray-700"}>
                        ({item.size})
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text className={"flex-1 text-gray-700"}>
                        {item.name}
                      </Text>
                    </>
                  )}

                  {item.discount_value ? (
                    <Text className={"text-gray-700"}>
                      {(
                        Math.round(
                          item.price *
                            ((100 - item.discount_value) / 100) *
                            item.quantity *
                            1000
                        ) / 1000
                      ).toFixed(3)}{" "}
                      BD
                    </Text>
                  ) : (
                    <Text className={"text-gray-700"}>
                      {(
                        Math.round(item.price * item.quantity * 1000) / 1000
                      ).toFixed(3)}{" "}
                      BD
                    </Text>
                  )}
                </View>
              ))}

              <View className={"flex-row flex-1"}>
                <Text className={"flex-1 text-lg"}>Total</Text>
                <Text className={"text-lg"}>
                  {(Math.round(order.total * 1000) / 1000).toFixed(3)} BD
                </Text>
              </View>
            </View>

            <Divider />

            {order.status !== "Cancelled" && order.status !== "Delivered" && (
              <View className={"py-6"}>
                <Text className={"text-xl font-semibold mb-2"}>
                  Expected Delivery Date
                </Text>

                {user.id === shop.owner_id ? (
                  <>
                    {Platform.OS === "ios" ? (
                      <>
                        <View className={"flex-row flex-1 items-center mb-3"}>
                          <Text className={"flex-1 text-lg"}>Date</Text>
                          <RNDateTimePicker
                            value={expectedDate}
                            mode="date"
                            onChange={(event, date) => {
                              setExpectedDate(date);
                            }}
                            style={{ flex: 1 }}
                          />
                        </View>
                        <View className={"flex-row flex-1 items-center"}>
                          <Text className={"flex-1 text-lg"}>Time</Text>
                          <RNDateTimePicker
                            value={expectedTime}
                            mode="time"
                            onChange={(event, date) => {
                              setExpectedTime(date);
                            }}
                            style={{ flex: 1 }}
                          />
                        </View>
                      </>
                    ) : (
                      <>
                        <View className={"flex-row flex-1 items-center mb-3"}>
                          <Text className={"flex-1 text-lg"}>Date</Text>
                          <TouchableOpacity
                            className={"flex-row items-center"}
                            onPress={() => setDatePickerOpened(true)}
                          >
                            <CalendarDaysIcon
                              size={25}
                              style={tw("text-blue-500 mr-2")}
                            />
                            <Text>{expectedDate.toDateString()}</Text>
                          </TouchableOpacity>
                          {useMemo(() => {
                            return (
                              datePickerOpened && (
                                <RNDateTimePicker
                                  value={expectedDate}
                                  mode="date"
                                  onChange={(event, date) => {
                                    setExpectedDate(date);
                                    setDatePickerOpened(false);
                                  }}
                                  display="default"
                                />
                              )
                            );
                          }, [datePickerOpened])}
                        </View>

                        <View className={"flex-row flex-1 items-center mb-3"}>
                          <Text className={"flex-1 text-lg"}>Time</Text>
                          <TouchableOpacity
                            className={"flex-row items-center"}
                            onPress={() => setTimePickerOpened(true)}
                          >
                            <ClockIcon
                              size={25}
                              style={tw("text-blue-500 mr-2")}
                            />
                            <Text>
                              {expectedTime.getHours() < 10
                                ? "0" + expectedTime.getHours()
                                : expectedTime.getHours()}
                              :
                              {expectedTime.getMinutes() < 10
                                ? "0" + expectedTime.getMinutes()
                                : expectedTime.getMinutes()}
                            </Text>
                          </TouchableOpacity>
                          {useMemo(() => {
                            return (
                              timePickerOpened && (
                                <RNDateTimePicker
                                  value={expectedTime}
                                  mode="time"
                                  onChange={(event, date) => {
                                    setExpectedTime(date);
                                    setTimePickerOpened(false);
                                  }}
                                  display="default"
                                />
                              )
                            );
                          }, [timePickerOpened])}
                        </View>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {order.status === "Pending" ? (
                      <View></View>
                    ) : (
                      <View className={"flex-row flex-1 items-center mb-3"}>
                        <Text className={"flex-1 text-lg"}>Date</Text>
                        <Text>{dateFormat}</Text>
                      </View>
                    )}
                  </>
                )}
              </View>
            )}

            {order.status === "Ongoing" &&
              (expectedDate.getTime() !==
                new Date(order.expected_date).getTime() ||
                expectedTime.getTime() !==
                  new Date(order.expected_date).getTime()) && (
                <TouchableOpacity
                  onPress={() => {
                    updateDeliveryDate(order.id, expectedDate, expectedTime);
                    const popAction = StackActions.pop(2);
                    navigation.dispatch(popAction);
                  }}
                  className={
                    "w-full justify-center items-center rounded rounded-lg bg-blue-500 p-3"
                  }
                >
                  <Text className={"text-lg font-medium text-white"}>
                    Edit Delivery Time
                  </Text>
                </TouchableOpacity>
              )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default OrderDetails;
