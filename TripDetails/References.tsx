import React from 'react'
import { View, Text } from 'react-native'
import { useTheme } from '@/Theme'
import { IReference } from '@/Interfaces/Reference'

type Props = {
  data: IReference[]
}

const References: React.FC<Props> = ({ data }) => {
  const { Gutters, Layout, Colors, Images, Fonts } = useTheme()

  return (
    <View style={[Layout.fullWidth]}>
      <View style={[Layout.fill, Layout.row, Layout.alignItemsEnd]}>
        <Text
          style={[
            Layout.wrap,
            Layout.fill,
            Fonts.paragraphRegular,
            { color: Colors.text },
          ]}
        >
          {(data || []).map((reference, index) => (
            <Text key={index}>
              <Text>{reference.name + ': '}</Text>
              <Text style={Fonts.paragraphLightBoldRegular}>
                {reference.value}
              </Text>
              {data && index !== data.length - 1 && `\n`}
            </Text>
          ))}
        </Text>
      </View>
    </View>
  )
}

export default References
