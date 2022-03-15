import React from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { useTheme } from '@/Theme'
import { useShowHideText } from '@/Services/Helpers'

const NUMBER_OF_LINES = 2

type Props = {
  data: string
}

const Instructions: React.FC<Props> = ({ data }) => {
  const { Gutters, Layout, Colors, Images, Fonts } = useTheme()
  const [
    isFullTextShown,
    isToggleTextButtonShown,
    onTextLayout,
    toggleRefTextState,
  ] = useShowHideText(NUMBER_OF_LINES)

  return (
    <View style={[Layout.fullWidth, Gutters.scale160TMargin]}>
      <View style={[Layout.fill, Layout.row, Layout.alignItemsEnd]}>
        <Text
          style={[
            Layout.wrap,
            Layout.fill,
            Fonts.paragraphRegular,
            { color: Colors.text },
          ]}
          onTextLayout={onTextLayout}
          numberOfLines={isFullTextShown ? undefined : NUMBER_OF_LINES}
        >
          <Text>Special Instructions: </Text>
          <Text style={Fonts.paragraphLightBoldRegular}>{data}</Text>
        </Text>
        {isToggleTextButtonShown && (
          <TouchableOpacity
            onPress={toggleRefTextState}
            style={[
              Gutters.scale100VPadding,
              Gutters.scale180HPadding,
              { marginRight: -18, marginTop: -6 },
            ]}
          >
            <Image
              style={isFullTextShown && Layout.mirrorV}
              source={Images.icons.triangle}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default Instructions
