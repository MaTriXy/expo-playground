import { StatusBar } from "expo-status-bar";
import { View, Text, Image, ImageBackground, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, interpolate } from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { router } from "expo-router";

const DROPDOWN_LINKS = [
    { icon: "user", label: "Profile" },
    { icon: "settings", label: "Settings" },
    { icon: "bell", label: "Notifications" },
    { icon: "log-out", label: "Logout" },
];

export default function Dropdown() {
    const insets = useSafeAreaInsets();
    const isExpanded = useSharedValue(0);

    const toggleDropdown = () => {
        isExpanded.value = withSpring(isExpanded.value === 0 ? 1 : 0, {
            damping: 90,
            stiffness: 700,
        });
    };

    const dropdownAnimatedStyle = useAnimatedStyle(() => {
        const width = interpolate(isExpanded.value, [0, 1], [160, 260]);
        const height = interpolate(isExpanded.value, [0, 1], [48, 290]);
        const borderRadius = interpolate(isExpanded.value, [0, 1], [30, 30]);

        return {
            width,
            height,
            borderRadius,
        };
    });

    const iconAnimatedStyle = useAnimatedStyle(() => {
        const rotate = interpolate(isExpanded.value, [0, 1], [0, 0]);
        const translateX = interpolate(isExpanded.value, [0, 1], [0, -10]);
        const translateY = interpolate(isExpanded.value, [0, 1], [0, 10]);
        return {
            transform: [{ rotate: `${rotate}deg` }, { translateX }, { translateY }],
        };
    });

    const getLinkAnimatedStyle = (index: number) => {
        return useAnimatedStyle(() => {
            const delay = index * 0.08;
            const adjustedProgress = Math.max(0, Math.min(1, (isExpanded.value - delay) / (1 - delay)));
            const opacity = interpolate(adjustedProgress, [0, 0.5, 1], [0, 0, 1]);
            const translateY = interpolate(adjustedProgress, [0, 1], [10, 0]);
            return {
                opacity,
                transform: [{ translateY }],
            };
        });
    };
    const onlineAnimatedStyle = useAnimatedStyle(() => {
        const scale = interpolate(isExpanded.value, [0, 1], [0, 1]);
        return {
            transform: [{ scale }],
        };
    });

    const profileAnimatedStyle = useAnimatedStyle(() => {
        const scale = interpolate(isExpanded.value, [0, 1], [1, 1.3]);
        const translateX = interpolate(isExpanded.value, [0, 1], [0, 10]);
        const translateY = interpolate(isExpanded.value, [0, 1], [0, 10]);
        return {
            transform: [{ scale }, { translateX }, { translateY }],
        };
    });

    const nameAnimatedStyle = useAnimatedStyle(() => {
        const scale = interpolate(isExpanded.value, [0, 1], [1, 1.3]);
        const translateX = interpolate(isExpanded.value, [0, 1], [0, 20]);
        const translateY = interpolate(isExpanded.value, [0, 1], [0, 10]);
        return {
            transform: [{ scale }, { translateX }, { translateY }],
        };
    });

    const rotateAnimatedStyle = useAnimatedStyle(() => {
        const rotate = interpolate(isExpanded.value, [0, 1], [0, 180]);
        return {
            transform: [{ rotate: `${rotate}deg` }],
        };
    });

    return (
        <View className="flex-1 bg-background">
            <StatusBar style="light" />
            <ImageBackground source={require("@/assets/img/bg.webp")} className="w-full h-full relative" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
                <View className="flex-1 p-6 justify-start">
                    <Animated.View style={dropdownAnimatedStyle} className="relative  rounded-3xl overflow-hidden">
                        {/* BlurView background */}
                        <BlurView
                            intensity={40}
                            tint="light"
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,

                            }}
                        >
                            <View
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    backgroundColor: 'rgba(255, 255, 255, 0)',
                                }}
                            />
                        </BlurView>

                        {/* Header */}
                        <Pressable onPress={toggleDropdown} className="flex-row items-center px-2 py-2">
                            <Animated.View style={{ ...profileAnimatedStyle, transformOrigin: 'left' }} className="origin-left  relative w-10 h-10 rounded-full">
                                <Image source={require("@/assets/img/user-1.jpg")} className="w-10 h-10 border border-black/20 rounded-full" />
                                <Animated.View style={onlineAnimatedStyle} className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400 border border-[#333430]" />
                            </Animated.View>
                            <Animated.View style={nameAnimatedStyle}>
                                <Text className="text-white mx-3 text-sm font-semibold">John Doe</Text>
                            </Animated.View>
                            <Animated.View style={{ ...iconAnimatedStyle }} className="ml-auto mr-1">
                                <Animated.View style={rotateAnimatedStyle}>
                                    <Feather name="chevron-down" size={16} color="white" />
                                </Animated.View>
                            </Animated.View>
                        </Pressable>

                        {/* Dropdown Links */}
                        <View className="px-4 pt-8" pointerEvents={isExpanded.value > 0.5 ? "auto" : "none"}>
                            {DROPDOWN_LINKS.map((link, index) => (
                                <Animated.View key={index} style={getLinkAnimatedStyle(index)}>
                                    <Pressable
                                        className="flex-row items-center py-3 pl-4 pr-3 mb-2 rounded-3xl border border-white/5"
                                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                                    >
                                        <Feather name={link.icon as any} size={17} color="white" />
                                        <Text className="text-white text-base font-medium ml-3">{link.label}</Text>
                                        <Feather name="chevron-right" size={14} color="white" className="ml-auto opacity-60" />
                                    </Pressable>
                                </Animated.View>
                            ))}
                        </View>
                    </Animated.View>
                </View>
                <View className="px-4">
                    <Pressable onPress={() => router.push("/")} className="rounded-2xl bg-neutral-950 p-4 items-center justify-center flex">
                        <Text className="text-white text-base font-semibold">Home</Text>
                    </Pressable>
                </View>
            </ImageBackground>
        </View>
    );
}