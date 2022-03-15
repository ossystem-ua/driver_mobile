import React, { useState } from 'react'
import { LayoutChangeEvent, Text, TouchableOpacity, View } from 'react-native'
import { IEvent } from '@/Interfaces/Event'
import { useTheme } from '@/Theme'
import { normalizeLocationToString } from '@/Services/Helpers'
import { formatTripDate } from '@/Services/Date'
import { TripStopTypes, TripStopStatuses } from '@/Config/Constants'
import { useTranslation } from 'react-i18next'
import LinearGradient from 'react-native-linear-gradient'

type ListItemProps = {
  data: IEvent
  onPress: (guid: string, title: string, status: TripStopStatuses) => void
  index: number
  getElementsHeight: (e: LayoutChangeEvent, index: number) => void
}

const { COMPLETED, PENDING, LATE, CHECKED_IN } = TripStopStatuses

const eventStatusConfig = {
  [COMPLETED]: { label: 'statuses.completed', color: 'completed' },
  [PENDING]: { label: 'statuses.pending', color: 'pendingSecond' },
  [LATE]: { label: 'statuses.late', color: 'late' },
  [CHECKED_IN]: { label: 'statuses.checkedIn', color: 'pendingSecond' },
}

const Event: React.FC<ListItemProps> = ({
  data,
  onPress,
  index,
  getElementsHeight,
}) => {
  const { Gutters, Layout, Colors, MetricsSizes, Fonts, Common } = useTheme()
  const { t } = useTranslation()
  const { guid, location, telEventIndex, status, eventType } = data

  const getEarlyTimeString = (event: any) => {
    const { eventEarlyDate, appointmentDate } = event
    if (!!appointmentDate) {
      return formatTripDate(appointmentDate, true)
    }
    return formatTripDate(eventEarlyDate, true)
  }

  const locationStringWithoutCity = normalizeLocationToString(location, [
    location.city,
  ])

  const title = `${eventType === TripStopTypes.PICKUP
    ? t('statuses.pickUp')
    : t('statuses.drop')
    } ${telEventIndex}`

  return (
    <TouchableOpacity
      onPress={() => onPress(guid, title, status)}
      onLayout={e => getElementsHeight(e, index)}
      style={{
        ...Layout.fill,
        ...Common.borderRadius,
        ...Gutters.scale80VMargin,
        backgroundColor: Colors.tripCardBackground,
        padding: MetricsSizes.scale120,
      }}
    >
      <View
        style={[Layout.col, Gutters.smallHPadding, Layout.scrollSpaceBetween]}
      >
        <View style={[Layout.row, Layout.justifyContentBetween]}>
          <View style={[Layout.row, Layout.alignItemsCenter]}>
            <Text
              style={[
                {
                  ...Fonts.labelLightBoldRegular,
                  ...Gutters.scale160RMargin,
                  color: Colors.text,
                },
              ]}
            >
              {title}
            </Text>
            <Text
              style={[
                Fonts.labelLightBoldRegular,
                { color: Colors[eventStatusConfig[status].color] },
              ]}
            >
              {t(`${eventStatusConfig[status].label}`)}
            </Text>
          </View>

          <View style={[Layout.row, Layout.alignItemsCenter]}>
            <Text style={[{ ...Fonts.paragraphRegular, color: Colors.text }]}>
              {getEarlyTimeString(data)}
            </Text>
          </View>
        </View>
        <View style={Gutters.scale80TMargin}>
          <Text style={[{ ...Fonts.paragraphRegular, color: Colors.text }]}>
            {location.city}, {'\n'}
            {locationStringWithoutCity}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

type ListProps = {
  data: IEvent[]
  onEventPress: (guid: string, title: string, status: TripStopStatuses) => void
}

const Events: React.FC<ListProps> = ({ data, onEventPress }) => {
  const { Gutters, Layout, Colors, Common } = useTheme()
  const [elementsHeightArray, setElementsArray] = useState(
    Array(data.length).fill(0),
  )

  const dotHeight = 8
  const dotWidth = 8
  const lineWidth = 2

  const getElementsHeight = (e: LayoutChangeEvent, index: number) => {
    const layout = e.nativeEvent.layout
    const elementsHeightArrayCopy = [...elementsHeightArray]
    elementsHeightArrayCopy.splice(index, 1, layout.height)
    setElementsArray(elementsHeightArrayCopy)
  }

  const lineItemHeight = elementsHeightArray
    .map((el, index) =>
      index !== elementsHeightArray.length - 1
        ? el / 2 + elementsHeightArray[index + 1] / 2 + dotHeight * 2
        : 0,
    )
    .filter(i => !!i)

  return (
    <View style={[Gutters.scale160RMargin, Gutters.scale80TMargin]}>
      {data.map((event, index) => (
        <View style={[Layout.row]} key={event.guid}>
          <View style={Layout.colCenter}>
            <View
              style={{
                width: dotWidth,
                height: dotHeight,
                backgroundColor: Colors[eventStatusConfig[event.status].color],
                ...Common.borderRadiusRound,
                ...Gutters.scale80HMargin,
                ...Layout.relative,
              }}
            >
              {index !== data.length - 1 && (
                <LinearGradient
                  colors={[
                    Colors[eventStatusConfig[data[index].status].color],
                    Colors[eventStatusConfig[data[index + 1].status].color],
                  ]}
                  style={{
                    ...Layout.absolute,
                    height: lineItemHeight[index],
                    width: lineWidth,
                    left: (dotWidth - lineWidth) / 2,
                  }}
                />
              )}
            </View>
          </View>
          <Event
            data={event}
            onPress={onEventPress}
            index={index}
            getElementsHeight={getElementsHeight}
          />
        </View>
      ))}
    </View>
  )
}

export default Events
