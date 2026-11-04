import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "terms.ftl" });

const meta = {
  title: "login/terms.ftl",
  component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <KcPageStory
      kcContext={{
        locale: {
          currentLanguageTag: "ko"
        },
        "x-keycloakify": {
          messages: {
            termsTitle: "서비스 이용약관",
            termsText:
              "<p>약관 상세보기 화면 확인을 위한 <strong>예시 문구</strong>입니다.</p><p>실제 서비스에서는 Keycloak에 설정한 약관 내용이 표시됩니다.</p>"
          }
        }
      }}
    />
  )
};

export const French: Story = {
  render: () => (
    <KcPageStory
      kcContext={{
        locale: {
          currentLanguageTag: "fr"
        },
        "x-keycloakify": {
          // cSpell: disable
          messages: {
            termsText: "<p>Mes terme en <strong>Français</strong></p>"
          }
          // cSpell: enable
        }
      }}
    />
  )
};

export const Spanish: Story = {
  render: () => (
    <KcPageStory
      kcContext={{
        locale: {
          currentLanguageTag: "es"
        },
        "x-keycloakify": {
          messages: {
            termsText: "<p>Mis términos en <strong>Español</strong></p>"
          }
        }
      }}
    />
  )
};

export const LongMessage: Story = {
  render: () => (
    <KcPageStory
      kcContext={{
        "x-keycloakify": {
          messages: {
            termsText: `
                            <p>These are the terms and conditions. Please read them carefully.</p>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum.</p>
                            <p>Cras vehicula diam vel metus faucibus, at scelerisque lacus pretium. Donec ac consectetur justo. Morbi in sollicitudin nulla.</p>
                            <p>Suspendisse potenti. Phasellus pharetra consequat ante, at dictum ligula volutpat a. Quisque ultricies velit nec nulla gravida accumsan.</p>
                            <p>Curabitur tristique, magna id hendrerit tristique, enim nunc laoreet erat, non accumsan lacus arcu et nulla.</p>
                            <p>Fusce feugiat nisi orci, in placerat dui luctus ut. Suspendisse in velit eu urna auctor consequat a euismod enim.</p>
                            <p>Etiam et massa a sapien pharetra mollis. In lacinia quam id libero tincidunt, at egestas felis viverra.</p>
                            <p>Nunc pulvinar imperdiet facilisis. Curabitur ultricies dictum lectus, nec consectetur metus fringilla id.</p>
                            <p><strong>Please accept the terms to proceed.</strong></p>
                        `
          }
        }
      }}
    />
  )
};
