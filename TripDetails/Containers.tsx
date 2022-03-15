import React from 'react'
import { useTheme } from '@/Theme'
import { Text, TouchableOpacity, View } from 'react-native'
import { IDetailedTrip } from '@/Interfaces/Trip'
import { useTranslation } from 'react-i18next'
import { modalKinds } from '@/Config'
import { useDispatch } from 'react-redux'
import { useLinkTo } from '@react-navigation/native'
import ChangeModal from '@/Store/App/ChangeModal'

const { CHANGE_CONTAINER } = modalKinds

type Props = {
  containers: IDetailedTrip['containers']
  tripGuid: string
  isContainerChangePossible: boolean
}

const Containers: React.FC<Props> = ({
  containers,
  tripGuid,
  isContainerChangePossible,
}) => {
  const { Layout, Gutters, Fonts, Colors, Common } = useTheme()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const linkTo = useLinkTo()

  const onPress = (
    containerGuid: string,
    containerNumber: string,
    containerInitial: string,
  ) => {
    dispatch(
      ChangeModal.action({
        modalKind: CHANGE_CONTAINER,
        modalData: {
          containerGuid,
          tripGuid,
          containerNumber,
          containerInitial,
        },
      }),
    )
    linkTo('/Modal')
  }

  return (
    <View style={[Layout.column, Layout.fullWidth, Layout.alignItemsCenter]}>
      {containers.map(({ containerNumber, containerInitial, guid }, index) => (
        <View
          key={index}
          style={[
            Layout.row,
            Layout.fullWidth,
            Gutters.scale160TMargin,
            Layout.alignItemsCenter,
          ]}
        >
          <View
            style={[
              Layout.row,
              Layout.fill,
              Layout.wrap,
              Gutters.scale120RMargin,
            ]}
          >
            <Text style={[Fonts.labelRegular, { color: Colors.text }]}>
              {t('labels.container')}:
              <Text style={Fonts.labelLightBoldRegular}>{` ${[
                containerInitial,
                containerNumber,
              ]
                .filter(i => !!i)
                .join('')}`}</Text>
            </Text>
          </View>
          {isContainerChangePossible && (
            <TouchableOpacity
              style={[Common.button.outlineRounded, { width: 100 }]}
              onPress={() => onPress(guid, containerNumber, containerInitial)}
            >
              <Text
                style={[Fonts.labelLightBoldRegular, { color: Colors.primary }]}
              >
                {t('actions.change')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  )
}

export default Containers
