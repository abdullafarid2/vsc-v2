import React, { useEffect, useLayoutEffect, useState, useMemo } from "react";
import {
  Image,
  Platform,
  ScrollView,
  Text,
  TextInput as RNTextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTailwind } from "tailwindcss-react-native";
import useOffers from "../hooks/useOffers";
import { ActivityIndicator, MD2Colors, TextInput } from "react-native-paper";
import useAuth from "../hooks/useAuth";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { CalendarDaysIcon, ClockIcon } from "react-native-heroicons/outline";

const AddOffer = () => {
  const tw = useTailwind();
  const navigation = useNavigation();
  const route = useRoute();
  const { url } = useAuth();
  const { product } = route.params;
  const { getProductOffer, addOffer, deleteOffer } = useOffers();

  const [loading, setLoading] = useState(true);
  const [offer, setOffer] = useState(null);
  const [discount, setDiscount] = useState();
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [startDatePickerOpened, setStartDatePickerOpened] = useState(false);
  const [startTimePickerOpened, setStartTimePickerOpened] = useState(false);
  const [endDatePickerOpened, setEndDatePickerOpened] = useState(false);
  const [endTimePickerOpened, setEndTimePickerOpened] = useState(false);

  const formatDate = (date) => {
    let hours, minutes, dateFormat;

    hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    minutes =
      date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    dateFormat = date.toDateString() + ", " + hours + ":" + minutes;

    return dateFormat;
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: tw("bg-blue-500"),
      headerTintColor: "#FFFFFF",
      headerTitle: "",
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    getProductOffer(product.id).then((o) => {
      setOffer(o);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <View className={"flex-1 bg-white items-center justify-center"}>
        <ActivityIndicator animating={loading} color={MD2Colors.blue500} />
      </View>
    );
  } else {
    return (
      <View className={"flex-1 bg-white px-3"}>
        <ScrollView className={"mt-3"}>
          <Text className={"text-xl font-semibold my-3"}>Add Offer</Text>

          <View className={"justify-center items-center mt-4"}>
            <Image
              source={{ uri: product.photo }}
              className={"h-40 w-40 rounded rounded-lg"}
            />
            <Text className={"mt-2 text-lg font-medium"}>{product.name}</Text>
            <Text className={"mt-2 text-lg font-medium"}>
              Currently on Sale? {offer ? "Yes" : "No"}
            </Text>
          </View>

          {offer ? (
            <>
              <View className={"flex-row items-center justify-center mt-2"}>
                <Text className={"text-lg font-medium mr-2"}>
                  Current discount
                </Text>
                <Text className={"text-lg"}>{offer.discount_value}%</Text>
              </View>

              <View className={"flex-row items-center justify-center mt-2"}>
                <Text className={"text-lg font-medium mr-2"}>Start date</Text>
                <Text className={"text-lg"}>
                  {formatDate(new Date(offer.start_date))}
                </Text>
              </View>

              <View className={"flex-row items-center justify-center mt-2"}>
                <Text className={"text-lg font-medium mr-2"}>End date</Text>
                <Text className={"text-lg"}>
                  {formatDate(new Date(offer.end_date))}
                </Text>
              </View>
            </>
          ) : (
            <>
              <View
                className={
                  "flex-1 flex-row justify-between items-center px-4 mt-3"
                }
              >
                <Text className={"font-medium text-lg mr-3"}>Discount %</Text>
                <TextInput
                  label="Discount"
                  underlineColor="#0099F9"
                  activeUnderlineColor="#0099F9"
                  className="bg-white flex-1"
                  value={discount}
                  onChangeText={(text) => setDiscount(text)}
                  error={discount < 1 || discount > 100}
                  render={(props) => (
                    <RNTextInput {...props} keyboardType="numeric" />
                  )}
                />
              </View>

              {Platform.OS === "ios" ? (
                <>
                  <View className={"flex-1 flex-row items-center px-4 mt-5"}>
                    <Text className={"font-medium text-lg mr-3"}>
                      Start date
                    </Text>
                    <RNDateTimePicker
                      value={startDate}
                      mode="date"
                      onChange={(event, date) => setStartDate(date)}
                      style={{ flex: 1 }}
                    />
                  </View>

                  <View
                    className={
                      "flex-1 flex-row justify-between items-center px-4 mt-4"
                    }
                  >
                    <Text className={"font-medium text-lg mr-3"}>
                      Start time
                    </Text>
                    <RNDateTimePicker
                      value={startTime}
                      mode="time"
                      onChange={(event, date) => setStartTime(date)}
                      style={{ flex: 1 }}
                    />
                  </View>

                  <View className={"flex-1 flex-row items-center px-4 mt-5"}>
                    <Text className={"font-medium text-lg mr-3"}>End date</Text>
                    <RNDateTimePicker
                      value={endDate}
                      mode="date"
                      onChange={(event, date) => setEndDate(date)}
                      style={{ flex: 1 }}
                    />
                  </View>

                  <View
                    className={
                      "flex-1 flex-row justify-between items-center px-4 mt-4"
                    }
                  >
                    <Text className={"font-medium text-lg mr-3"}>End time</Text>
                    <RNDateTimePicker
                      value={endTime}
                      mode="time"
                      onChange={(event, date) => setEndTime(date)}
                      style={{ flex: 1 }}
                    />
                  </View>
                </>
              ) : (
                <>
                  <View
                    className={
                      "flex-1 flex-row justify-between items-center px-4 mt-5"
                    }
                  >
                    <Text className={"font-medium text-lg mr-3"}>
                      Start date
                    </Text>
                    <TouchableOpacity
                      className={"flex-row items-center"}
                      onPress={() => setStartDatePickerOpened(true)}
                    >
                      <CalendarDaysIcon
                        size={25}
                        style={tw("text-blue-500 mr-2")}
                      />
                      <Text>{startDate.toDateString()}</Text>
                    </TouchableOpacity>
                    {useMemo(() => {
                      return (
                        startDatePickerOpened && (
                          <RNDateTimePicker
                            value={startDate}
                            mode="date"
                            onChange={(event, date) => {
                              setStartDate(date);
                              setStartDatePickerOpened(false);
                            }}
                            display="default"
                          />
                        )
                      );
                    }, [startDatePickerOpened])}
                  </View>

                  <View
                    className={
                      "flex-1 flex-row justify-between items-center px-4 mt-4"
                    }
                  >
                    <Text className={"font-medium text-lg mr-3"}>
                      Start time
                    </Text>
                    <TouchableOpacity
                      className={"flex-row items-center"}
                      onPress={() => setStartTimePickerOpened(true)}
                    >
                      <ClockIcon size={25} style={tw("text-blue-500 mr-2")} />
                      <Text>
                        {startTime.getHours() < 10
                          ? "0" + startTime.getHours()
                          : startTime.getHours()}
                        :
                        {startTime.getMinutes() < 10
                          ? "0" + startTime.getMinutes()
                          : startTime.getMinutes()}
                      </Text>
                    </TouchableOpacity>
                    {useMemo(() => {
                      return (
                        startTimePickerOpened && (
                          <RNDateTimePicker
                            value={startTime}
                            mode="time"
                            onChange={(event, date) => {
                              setStartTime(date);
                              setStartTimePickerOpened(false);
                            }}
                            display="default"
                          />
                        )
                      );
                    }, [startTimePickerOpened])}
                  </View>

                  <View
                    className={
                      "flex-1 flex-row justify-between items-center px-4 mt-5"
                    }
                  >
                    <Text className={"font-medium text-lg mr-3"}>End date</Text>
                    <TouchableOpacity
                      className={"flex-row items-center"}
                      onPress={() => setEndDatePickerOpened(true)}
                    >
                      <CalendarDaysIcon
                        size={25}
                        style={tw("text-blue-500 mr-2")}
                      />
                      <Text>{endDate.toDateString()}</Text>
                    </TouchableOpacity>
                    {useMemo(() => {
                      return (
                        endDatePickerOpened && (
                          <RNDateTimePicker
                            value={endDate}
                            mode="date"
                            onChange={(event, date) => {
                              setEndDate(date);
                              setEndDatePickerOpened(false);
                            }}
                            display="default"
                          />
                        )
                      );
                    }, [endDatePickerOpened])}
                  </View>

                  <View
                    className={
                      "flex-1 flex-row justify-between items-center px-4 mt-4"
                    }
                  >
                    <Text className={"font-medium text-lg mr-3"}>End time</Text>
                    <TouchableOpacity
                      className={"flex-row items-center"}
                      onPress={() => setEndTimePickerOpened(true)}
                    >
                      <ClockIcon size={25} style={tw("text-blue-500 mr-2")} />
                      <Text>
                        {endTime.getHours() < 10
                          ? "0" + endTime.getHours()
                          : endTime.getHours()}
                        :
                        {endTime.getMinutes() < 10
                          ? "0" + endTime.getMinutes()
                          : endTime.getMinutes()}
                      </Text>
                    </TouchableOpacity>
                    {useMemo(() => {
                      return (
                        endTimePickerOpened && (
                          <RNDateTimePicker
                            value={endTime}
                            mode="time"
                            onChange={(event, date) => {
                              setEndTime(date);
                              setEndTimePickerOpened(false);
                            }}
                            display="default"
                          />
                        )
                      );
                    }, [endTimePickerOpened])}
                  </View>
                </>
              )}
            </>
          )}

          {offer ? (
            <TouchableOpacity
              onPress={() =>
                deleteOffer(offer.id).then((res) => {
                  if (res) {
                    console.log(res);
                    navigation.goBack();
                  }
                })
              }
              className="my-8 bg-red-500 rounded rounded-lg p-3 justify-center items-center"
            >
              <Text className="text-lg font-semibold text-white">
                Cancel Offer
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() =>
                addOffer(
                  product.shop_id,
                  product.id,
                  discount,
                  startDate,
                  startTime,
                  endDate,
                  endTime
                ).then((res) => {
                  if (res) navigation.goBack();
                })
              }
              className="my-8 bg-blue-500 rounded rounded-lg p-3 justify-center items-center"
            >
              <Text className="text-lg font-semibold text-white">
                Add Offer
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    );
  }
};

export default AddOffer;
