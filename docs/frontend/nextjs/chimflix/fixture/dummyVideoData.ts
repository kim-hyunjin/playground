import { YoutubeSnippetsWithPage } from '@/lib/videos';

export const fetchDummyData = (pageToken?: string): YoutubeSnippetsWithPage => {
  if (pageToken) {
    return (
      dummyData.find((d) => d.pageToken === pageToken) || {
        datas: dummyData[dummyData.length - 1].datas,
        nextPageToken: null,
      }
    );
  } else {
    return dummyData[0];
  }
};

export const fetchDummyPlaylist = (): YoutubeSnippetsWithPage => {
  return { datas: dummyPlaylist.json, nextPageToken: null };
};

export const fetchDummyPlaylistItem = (): YoutubeSnippetsWithPage => {
  return { datas: dummyPlaylistItem[0].json, nextPageToken: null };
};

const dummyData = [
  {
    pageToken: null,
    datas: [
      {
        id: 'qKRGsHDXNa0',
        imgUrl: 'https://i.ytimg.com/vi/qKRGsHDXNa0/maxresdefault.jpg',
        title: '침착맨 A.I. 모음집',
        description:
          '관련 영상 •인공지능 빅스비 설정하기: https://youtu.be/efM331Fa5GY •제네시스 G80의 놀라운 기능: https://youtu.be/RSM04ztYJ3E ...',
      },
      {
        id: 'LqJHGEMZ1YU',
        imgUrl: 'https://i.ytimg.com/vi/LqJHGEMZ1YU/maxresdefault.jpg',
        title: '(잔인주의) 서부시대 무신사룩 쇼핑 브이로그',
        description:
          '관련 영상 •너굴모자를 쓰는 자 그 무게를 견뎌라: https://youtu.be/Hb4tRPdCt6M ▷관련 재생목록 •레드 데드 리뎀션 2 (Red Dead ...',
      },
      {
        id: 'A5J8DfvPt28',
        imgUrl: 'https://i.ytimg.com/vi/A5J8DfvPt28/maxresdefault.jpg',
        title: '내 자취방을 윤택하게 해줄 단 하나의 요정은? Remastered',
        description:
          '관련 영상 •【침&펄】 내 자취방을 윤택하게 해줄 단 하나의 요정은?: https://youtu.be/tGBDyStMr68 ▷관련 재생목록 •침착맨의 일상 ...',
      },
      {
        id: '6Di6dOV396k',
        imgUrl: 'https://i.ytimg.com/vi/6Di6dOV396k/maxresdefault.jpg',
        title: '&#39;A WAY OUT&#39; 하이라이트 모음집',
        description: '관련 재생목록 •【침착맨X주호민】 어 웨이 아웃 (A WAY OUT): ...',
      },
      {
        id: 'mikIpYryHqo',
        imgUrl: 'https://i.ytimg.com/vi/mikIpYryHqo/maxresdefault.jpg',
        title: '천하제일 편식대회! 식사 메뉴 월드컵 Remastered',
        description:
          '관련 영상 •【침착맨】 천하제일 편식대회! 식사 메뉴 월드컵 1부: https://youtu.be/3lMSyPHLHyo ▷관련 재생목록 •침착맨의 이상형 ...',
      },
      {
        id: 'cc8cPIR_fy8',
        imgUrl: 'https://i.ytimg.com/vi/cc8cPIR_fy8/maxresdefault.jpg',
        title: '침착맨의 야간상담소 Remastered',
        description:
          '관련 영상 •【침착맨】 무엇이든 물어보세요 시청자 상담소: https://youtu.be/esymT2uCZjg ▷관련 재생목록 •침착맨의 일상재롱: ...',
      },
      {
        id: 'f2hlMqmHStQ',
        imgUrl: 'https://i.ytimg.com/vi/f2hlMqmHStQ/maxresdefault.jpg',
        title: '와우산 미세먼지 체험기 Remastered',
        description:
          '관련 영상 •【침펄풍】 와우산 미세먼지 체험기: https://youtu.be/r8cydvrGYfs ▷관련 재생목록 •침착맨의 일상재롱: ...',
      },
      {
        id: 'Z2A5INv7Q7U',
        imgUrl: 'https://i.ytimg.com/vi/Z2A5INv7Q7U/maxresdefault.jpg',
        title: '도전! 사투리 능력고사',
        description:
          '관련 영상 •시청자들과 함께 방구석 전국 팔도 유람: https://youtu.be/3hQcbrP2nn4 ▷관련 재생목록 •침착맨의 일상재롱: ...',
      },
      {
        id: 'YNezKdTm6hM',
        imgUrl: 'https://i.ytimg.com/vi/YNezKdTm6hM/maxresdefault.jpg',
        title: '가장 맛있는 과자 순위 정하기',
        description:
          '관련 영상 •경력 40년 과자 전문가의 아들, 침착맨이 뽑은 최고의 파이형 과자 월드컵: https://youtu.be/l2IGuOG8AOM ▷관련 재생목록 ...',
      },
      {
        id: 'sLXjsA3r6Ak',
        imgUrl: 'https://i.ytimg.com/vi/sLXjsA3r6Ak/maxresdefault.jpg',
        title: '스즈메의 문단속(Suzume, 2023) 감상회',
        description:
          "관련 영상 •【침&펄 영화 만들기】 #1 - '뇌파 vs 초음파' 등장인물 편: https://youtu.be/YYKrnBqh_eo ▷관련 재생목록 •침착맨의 일상 ...",
      },
      {
        id: '5z3LQkxR3y4',
        imgUrl: 'https://i.ytimg.com/vi/5z3LQkxR3y4/maxresdefault.jpg',
        title: '또 돌아온 판사 침착맨의 양형 체험 프로그램',
        description:
          '관련 영상 •돌아온 판사 침착맨의 양형 체험 프로그램: https://youtu.be/xcSmfXq1WOQ ▷관련 재생목록 •침착맨의 일상재롱: ...',
      },
      {
        id: '2JbgpQa0rV4',
        imgUrl: 'https://i.ytimg.com/vi/2JbgpQa0rV4/maxresdefault.jpg',
        title: '컴퓨터 팬 소음 잡는 팁',
        description:
          '관련 영상 •【침착맨】 노이즈가 심하다구요? 본격 세팅 방송: https://youtu.be/QS3d1ZkM8N8 •【침착맨】 낯빛이 어둡다구요?',
      },
      {
        id: 'iYPFRvQ9Jr4',
        imgUrl: 'https://i.ytimg.com/vi/iYPFRvQ9Jr4/maxresdefault.jpg',
        title: '춘추제로시대',
        description:
          '관련 영상 •제로 떡볶이 쿡방: https://youtu.be/8oxUo5b3-2M ▷관련 재생목록 •침착맨의 식욕저하 다이어트 먹방: ...',
      },
      {
        id: 'Hb4tRPdCt6M',
        imgUrl: 'https://i.ytimg.com/vi/Hb4tRPdCt6M/maxresdefault.jpg',
        title: '(잔인주의) 너굴모자를 쓰는 자 그 무게를 견뎌라',
        description:
          '관련 영상 •(잔인주의) 너굴맨의 개과천선: https://youtu.be/l1Vncs1qw_M ▷관련 재생목록 •레드 데드 리뎀션 2 (Red Dead ...',
      },
      {
        id: 'Ynn6cHoPWbE',
        imgUrl: 'https://i.ytimg.com/vi/Ynn6cHoPWbE/maxresdefault.jpg',
        title: '미라는 왜 만들어졌을까?',
        description:
          '관련 영상 •이집트 전문가의 카트라이더 이집트 맵 분석하기: https://youtu.be/vagBS9UA6RE ▷관련 재생목록 •침착맨과 특강: ...',
      },
      {
        id: '8oxUo5b3-2M',
        imgUrl: 'https://i.ytimg.com/vi/8oxUo5b3-2M/maxresdefault.jpg',
        title: '제로 떡볶이 쿡방',
        description:
          '관련 영상 •제로 떡볶이는 가능한가: https://youtu.be/Ge2iZZr43_Y ▷관련 재생목록 •  ‍  불만 피우면 쿡방: ...',
      },
      {
        id: 'wgsNwALH17g',
        imgUrl: 'https://i.ytimg.com/vi/wgsNwALH17g/maxresdefault.jpg',
        title: '랜덤 물건 가격 맞히기',
        description:
          '관련 영상 •미술 작품 가격 맞히기: https://youtu.be/yZv-Lc6sAtU ▷관련 재생목록 •침착맨의 일상재롱: https://goo.gl/OJ4Uoa ...',
      },
      {
        id: 'BnMR8E8mB0E',
        imgUrl: 'https://i.ytimg.com/vi/BnMR8E8mB0E/maxresdefault.jpg',
        title: '즉석으로 올린 시청자 책상 상태 구경하기',
        description:
          '관련 영상 •시청자 방 훈수하기: https://youtu.be/Uepu0fO--9E ▷관련 재생목록 •침착맨의 일상재롱: https://goo.gl/OJ4Uoa ▷생방송 ...',
      },
      {
        id: '4y53gppRDUo',
        imgUrl: 'https://i.ytimg.com/vi/4y53gppRDUo/maxresdefault.jpg',
        title: '최고의 돼지고기 요리 월드컵',
        description:
          '관련 영상 •중국 요리 월드컵 64강: https://youtu.be/aDZB9FewV0M ▷관련 재생목록 •침착맨의 이상형 월드컵: ...',
      },
      {
        id: 'tH3A6gbAwt4',
        imgUrl: 'https://i.ytimg.com/vi/tH3A6gbAwt4/maxresdefault.jpg',
        title: '백반 먹방과 인간 좌약',
        description:
          '관련 영상 •금태와 금태양: https://youtu.be/jEDqcpuhNac ▷관련 재생목록 •침착맨의 식욕저하 다이어트 먹방: https://url.kr/a4vk8m ...',
      },
      {
        id: 'zEU1JhXABUA',
        imgUrl: 'https://i.ytimg.com/vi/zEU1JhXABUA/maxresdefault.jpg',
        title: '모자를 쓰고 방송하는 이유',
        description:
          '관련 영상 •지각은 왜 하는가?: https://youtu.be/J8TonSFgDk4 ▷관련 재생목록 •침착맨의 일상재롱: https://goo.gl/OJ4Uoa ▷생방송 ...',
      },
      {
        id: 'eblo05Q4-N4',
        imgUrl: 'https://i.ytimg.com/vi/eblo05Q4-N4/maxresdefault.jpg',
        title: '왜 먹지를 못하는가',
        description:
          '관련 영상 •8090 국산 차 월드컵: https://youtu.be/gME5_YiCGr0 ▷관련 재생목록 •침착맨의 식욕저하 다이어트 먹방: ...',
      },
      {
        id: 'gME5_YiCGr0',
        imgUrl: 'https://i.ytimg.com/vi/gME5_YiCGr0/maxresdefault.jpg',
        title: '8090 국산 차 월드컵',
        description:
          '관련 영상 •【침펄풍】 눈쌀 찌푸려지는 튜닝카는? 극혐 양카 월드컵: https://youtu.be/X-IAT_AFTKs ▷관련 재생목록 •침착맨의 ...',
      },
      {
        id: 'N7UPueuKt_4',
        imgUrl: 'https://i.ytimg.com/vi/N7UPueuKt_4/maxresdefault.jpg',
        title: '고도로 발달한 닭껍질교자는 고추와 구분할 수 없다',
        description:
          '관련 영상 •사이좋게 나눠먹는 분식: https://youtu.be/FwAf4mbaVis ▷관련 재생목록 •침착맨의 식욕저하 다이어트 먹방: ...',
      },
      {
        id: 'g40UmIS3MHE',
        imgUrl: 'https://i.ytimg.com/vi/g40UmIS3MHE/maxresdefault.jpg',
        title: '주호민 새로운 작업실 알아보기',
        description:
          '관련 영상 •침투부 회사 사옥 쇼핑: https://youtu.be/n9HYZdhsm3o ▷관련 재생목록 •침착맨의 일상재롱: https://goo.gl/OJ4Uoa ...',
      },
    ],
    nextPageToken: 'CDIQAA',
  },
  {
    pageToken: 'CDIQAA',
    datas: [
      {
        id: 'Uqq_tDKxnEg',
        imgUrl: 'https://i.ytimg.com/vi/Uqq_tDKxnEg/maxresdefault.jpg',
        title: '이마트 롤 &amp; 마라강정',
        description:
          '관련 영상 •침착한 편식가 - 1화 "롤" 편 (完): https://www.youtube.com/watch?v=vq2EG7dIemA ▷관련 재생목록 •침착맨의 식욕저하 ...',
      },
      {
        id: 'jEDqcpuhNac',
        imgUrl: 'https://i.ytimg.com/vi/jEDqcpuhNac/maxresdefault.jpg',
        title: '금태와 금태양',
        description:
          '관련 재생목록 •침착맨의 일상재롱: https://goo.gl/OJ4Uoa ▷생방송 원본 •2023년 2월 14일 방송분: ...',
      },
      {
        id: 'C4PqIh8wvyI',
        imgUrl: 'https://i.ytimg.com/vi/C4PqIh8wvyI/maxresdefault.jpg',
        title: '뉴진스(가 광고한) 버거',
        description:
          '관련 영상 •  BTS brought me here  : https://youtu.be/Khis3zW4btU •【침&펄】 맥도날드 먹으면서 광고촬영 후기: ...',
      },
      {
        id: '4LKF086ky_s',
        imgUrl: 'https://i.ytimg.com/vi/4LKF086ky_s/maxresdefault.jpg',
        title: '다나카와 함께하는 한국 국물요리 월드컵',
        description:
          '관련 영상 •다나카 초대석: https://youtu.be/gwbLBsvWV_Y ▷관련 재생목록 •침착맨의 이상형 월드컵: ...',
      },
      {
        id: 'gwbLBsvWV_Y',
        imgUrl: 'https://i.ytimg.com/vi/gwbLBsvWV_Y/maxresdefault.jpg',
        title: '다나카 초대석',
        description:
          '관련 영상 •다나카와 함께하는 한국 국물요리 월드컵: https://youtu.be/4LKF086ky_s ▷관련 재생목록 •침착맨의 일상재롱: ...',
      },
      {
        id: 'PTJpv8cdvZ4',
        imgUrl: 'https://i.ytimg.com/vi/PTJpv8cdvZ4/maxresdefault.jpg',
        title: '귤(Mandarin orange)을 알아보자',
        description:
          '관련 영상 •【다이어트 먹방】 귤 먹기: https://youtu.be/rwL4KGbvSZg ▷관련 재생목록 •침착맨의 일상재롱: https://goo.gl/OJ4Uoa ...',
      },
      {
        id: 'rcHy957I4Hs',
        imgUrl: 'https://i.ytimg.com/vi/rcHy957I4Hs/maxresdefault.jpg',
        title: '게임은 패드로 해야 한다 vs 키마로 해야 한다',
        description:
          '침착맨 채널 구독자 이벤트   내가 응원하는 팀은⁉ ⌨로캣과 함께하는 침착맨 vs 터틀비치와 함께하는 주호민 공식 구매 링크:   ...',
      },
      {
        id: '7QnVBNbTVeM',
        imgUrl: 'https://i.ytimg.com/vi/7QnVBNbTVeM/maxresdefault.jpg',
        title: '궤도와 다시 하는 &#39;지금 당장 있으면 좋을 과학 기술 월드컵&#39;',
        description:
          '관련 영상 •놀러 온 궤도의 돈고추라면: https://youtu.be/j67xuAK_qz4 ▷관련 재생목록 •침착맨의 이상형 월드컵: ...',
      },
      {
        id: 'j67xuAK_qz4',
        imgUrl: 'https://i.ytimg.com/vi/j67xuAK_qz4/maxresdefault.jpg',
        title: '놀러 온 궤도의 돈고추라면',
        description:
          '관련 영상 •궤도와 다시 하는 지금 당장 있으면 좋을 과학 기술 월드컵: https://youtu.be/7QnVBNbTVeM ▷관련 재생목록 •  ‍  불만 ...',
      },
      {
        id: 'mhZBhpagdVU',
        imgUrl: 'https://i.ytimg.com/vi/mhZBhpagdVU/maxresdefault.jpg',
        title: '롯데리아 전주 비빔라이스 버거',
        description:
          '관련 영상 •먹으면 웃음이 절로 나오는 군대리아 세트: https://youtu.be/6oSBkEU1ohQ ▷관련 재생목록 •침착맨의 식욕저하 다이어트 ...',
      },
      {
        id: '5ahN5s59M5I',
        imgUrl: 'https://i.ytimg.com/vi/5ahN5s59M5I/maxresdefault.jpg',
        title: '한 달 늦은 뉴스 속보',
        description:
          '관련 영상 •침착맨이 요즘 관심있는 것들: https://youtu.be/w2wREDRrROk ▷관련 재생목록 •침착맨의 일상재롱: ...',
      },
      {
        id: 'l1Vncs1qw_M',
        imgUrl: 'https://i.ytimg.com/vi/l1Vncs1qw_M/maxresdefault.jpg',
        title: '(잔인주의) 너굴맨의 개과천선',
        description:
          '관련 영상 •(잔인주의) 선량한 사람은 너굴맨이 처리했으니 안심하라구: https://youtu.be/8hSds3puPQY ▷관련 재생목록 •레드 데드 ...',
      },
      {
        id: '7XRufU8uafs',
        imgUrl: 'https://i.ytimg.com/vi/7XRufU8uafs/maxresdefault.jpg',
        title: '학창 시절 가장 열받는 일 월드컵',
        description:
          '관련 영상 •카더가든 & 비비 초대석: https://youtu.be/ndaymi8Mss4 ▷관련 재생목록 •침착맨의 이상형 월드컵: ...',
      },
      {
        id: 'ndaymi8Mss4',
        imgUrl: 'https://i.ytimg.com/vi/ndaymi8Mss4/maxresdefault.jpg',
        title: '카더가든 &amp; 비비 초대석',
        description:
          '관련 영상 •이름이 많은 사람: https://youtu.be/eixLlnY-TrA •가수 비비 초대석: https://youtu.be/fA5BhaxRvN0 ▷관련 재생목록 •침착맨 ...',
      },
      {
        id: 'e2tttO-8LUw',
        imgUrl: 'https://i.ytimg.com/vi/e2tttO-8LUw/maxresdefault.jpg',
        title: '과자를 가루로 만들어 밥에 뿌려 드셔보시겠습니까?',
        description:
          '관련 영상 •신개념 사업 구상 - 가루 삼겹살: https://youtu.be/gwHQLBUStO4 ▷관련 재생목록 •침착맨의 식욕저하 다이어트 먹방: ...',
      },
      {
        id: 'VfD-rap67hk',
        imgUrl: 'https://i.ytimg.com/vi/VfD-rap67hk/maxresdefault.jpg',
        title: '아이돌 모르는 사람의 딥 러닝 암기법',
        description:
          '관련 영상 •딥 러닝으로 풀어보는 예능 게임: https://youtu.be/cUJmNvaVE3U ▷관련 재생목록 •침착맨의 일상재롱: ...',
      },
      {
        id: 'FwAf4mbaVis',
        imgUrl: 'https://i.ytimg.com/vi/FwAf4mbaVis/maxresdefault.jpg',
        title: '사이좋게 나눠먹는 분식',
        description:
          '관련 영상 •떡볶이로 식사가 될까?: https://youtu.be/WQokyoYgZ_s ▷관련 재생목록 •침착맨의 식욕저하 다이어트 먹방: ...',
      },
      {
        id: 'xTxEq_64uQs',
        imgUrl: 'https://i.ytimg.com/vi/xTxEq_64uQs/maxresdefault.jpg',
        title: '사진만 보고 무슨 라면인지 맞히기',
        description:
          '관련 영상 •가장 맛있는 라면을 뽑아라! 라면 월드컵: https://youtu.be/AcIZANFqEl8 ▷관련 재생목록 •침착맨의 일상재롱: ...',
      },
      {
        id: 'vxtFplAvnsM',
        imgUrl: 'https://i.ytimg.com/vi/vxtFplAvnsM/maxresdefault.jpg',
        title: '김치순두제비는 언제 먹나요?',
        description:
          '관련 영상 •돌아온 고마운 최고민수: https://youtu.be/YLxRBicbGh4 ▷관련 재생목록 •  ‍  불만 피우면 쿡방: ...',
      },
      {
        id: 'a6Kw3GQxcKg',
        imgUrl: 'https://i.ytimg.com/vi/a6Kw3GQxcKg/maxresdefault.jpg',
        title: '밀덕이 훌륭한 지휘관이 될 수 있을까?',
        description:
          "관련 영상 •임용한 박사님의 '전쟁사의 오해와 진실' 특강: https://youtu.be/rd2qDgHC1vg ▷관련 재생목록 •침착맨과 특강: ...",
      },
      {
        id: 'PhWyC9sPF0M',
        imgUrl: 'https://i.ytimg.com/vi/PhWyC9sPF0M/maxresdefault.jpg',
        title: '모든 분리수거의 신',
        description:
          '관련 영상 •최고의 인성쓰레기를 찾아라! 애니속 쓰레기 월드컵: https://youtu.be/3_YAPxrIuro ▷관련 재생목록 •침착맨의 일상재롱: ...',
      },
      {
        id: '8hSds3puPQY',
        imgUrl: 'https://i.ytimg.com/vi/8hSds3puPQY/maxresdefault.jpg',
        title: '(잔인주의) 선량한 사람은 너굴맨이 처리했으니 안심하라구',
        description:
          '관련 영상 •서부개척시대 브이로그: https://youtu.be/Wckcfh0Vu_E ▷관련 재생목록 •레드 데드 리뎀션 2 (Red Dead Redemption 2): ...',
      },
      {
        id: 'mdsaZz5WVHU',
        imgUrl: 'https://i.ytimg.com/vi/mdsaZz5WVHU/maxresdefault.jpg',
        title: '계속되는 남도형 성우와의 토크',
        description:
          '관련 영상 •성우 남도형 초대석: https://youtu.be/JgkdgAfTdBk ▷관련 재생목록 •침착맨의 일상재롱: https://goo.gl/OJ4Uoa ▷생방송 ...',
      },
      {
        id: 'JgkdgAfTdBk',
        imgUrl: 'https://i.ytimg.com/vi/JgkdgAfTdBk/maxresdefault.jpg',
        title: '성우 남도형 초대석',
        description:
          '관련 영상 •계속되는 남도형 성우와의 토크: https://youtu.be/mdsaZz5WVHU ▷관련 재생목록 •침착맨의 일상재롱: ...',
      },
      {
        id: 'koeM3TRigqU',
        imgUrl: 'https://i.ytimg.com/vi/koeM3TRigqU/maxresdefault.jpg',
        title: 'AI는 삼국지를 알까?',
        description:
          '관련 영상 •침vs풍 즉흥토론 - AI가 지배하는 세상, 온다 VS 안온다: https://youtu.be/QDSWCArqpYU ▷관련 재생목록 •침착맨의 일상 ...',
      },
    ],
    nextPageToken: 'CEsQAA',
  },
];

const dummyPlaylist = {
  json: [
    {
      id: 'PLif_jr7pPZADz0iAZ1K6G3hGbTZk4j82B',
      imgUrl: 'https://i.ytimg.com/vi/3btkx7wZsrg/hqdefault.jpg',
      title: '김풍의 일일 DJ',
      description: '',
    },
    {
      id: 'PLif_jr7pPZACx2rxp38Ljbm4l2N0YyaCs',
      imgUrl: 'https://i.ytimg.com/vi/JD-TLZvNE9Q/hqdefault.jpg',
      title: 'GTA 5 (Grand Theft Auto V)',
      description: '',
    },
    {
      id: 'PLif_jr7pPZADtlx8QIJNJF-6XURHoRO1k',
      imgUrl: 'https://i.ytimg.com/vi/Wckcfh0Vu_E/hqdefault.jpg',
      title: '레드 데드 리뎀션 2 (Red Dead Redemption 2)',
      description: '',
    },
    {
      id: 'PLif_jr7pPZACDdM6sB6Yr_0L0VGXEjF1b',
      imgUrl: 'https://i.ytimg.com/vi/ysetd_r8Z9M/hqdefault.jpg',
      title: '2023년 침착맨 정주행',
      description: '2023년에 나온 침착맨 영상을 정주행으로 즐겨 보세요.',
    },
    {
      id: 'PLif_jr7pPZABUzvHxpGD9IYUDczsRtIPo',
      imgUrl: 'https://i.ytimg.com/vi/3N4BFRDuY4U/hqdefault.jpg',
      title: '방랑화가 이병건',
      description: '21세기 풍속화 그리기',
    },
    {
      id: 'PLif_jr7pPZAB6YJFfAg8riV6NtIOqez6j',
      imgUrl: 'https://i.ytimg.com/vi/S_RuSVZHZeg/hqdefault.jpg',
      title: '2018년 침착맨 정주행',
      description: '2018년에 나온 침착맨 영상을 정주행으로 즐겨 보세요.',
    },
    {
      id: 'PLif_jr7pPZABZsONyeNz1JvpAOxPi8FIs',
      imgUrl: 'https://i.ytimg.com/vi/-4BvjRGDIAw/hqdefault.jpg',
      title: '2019년 침착맨 정주행',
      description: '2019년에 나온 침착맨 영상을 정주행으로 즐겨 보세요.',
    },
    {
      id: 'PLif_jr7pPZACQRnHMrh1kXkIRqaSghyt6',
      imgUrl: 'https://i.ytimg.com/vi/5BBCy033X-0/hqdefault.jpg',
      title: '(2022 추석특선) 침투부 같이보기',
      description: '침&펄 역전재판을 몰아본다.\n그것은 수행의 길.',
    },
    {
      id: 'PLif_jr7pPZAC94waP3RM4wn7QkWGy3zxg',
      imgUrl: 'https://i.ytimg.com/vi/y0ZWvfCWIhU/hqdefault.jpg',
      title: '2022 배도라지 MT',
      description: '',
    },
    {
      id: 'PLif_jr7pPZACSLJuDn8N1j_1jWudgxpi-',
      imgUrl: 'https://i.ytimg.com/vi/LuJiyc9icSs/hqdefault.jpg',
      title: '침펄인물사전',
      description: '침&펄이 직접 인터뷰해서 만드는 인물사전',
    },
    {
      id: 'PLif_jr7pPZADliLF8xwsm7BJHUqq_CUKo',
      imgUrl: 'https://i.ytimg.com/vi/jCyQVMAfBXk/hqdefault.jpg',
      title: '2020년 침착맨 정주행',
      description: '2020년에 나온 침착맨 영상을 정주행으로 즐겨 보세요.',
    },
    {
      id: 'PLif_jr7pPZADJ2MJ-iHlgLijM6xkCaFlo',
      imgUrl: 'https://i.ytimg.com/vi/sAkEow8H5lA/hqdefault.jpg',
      title: '2021년 침착맨 정주행',
      description: '2021년에 나온 침착맨 영상을 정주행으로 즐겨 보세요.',
    },
    {
      id: 'PLif_jr7pPZAD8EJtkFBBctqm5L38JqtGb',
      imgUrl: 'https://i.ytimg.com/vi/0pw5gBIAWQM/hqdefault.jpg',
      title: '2022년 침착맨 정주행',
      description: '2022년에 나온 침착맨 영상을 정주행으로 즐겨 보세요.',
    },
    {
      id: 'PLif_jr7pPZACfoFhBRTYpuhGn9etcTS3n',
      imgUrl: 'https://i.ytimg.com/vi/PBUBzuGPoVY/hqdefault.jpg',
      title: '침착맨과 함께 듣는 특강',
      description: '아는 것이 힘이다?\n모르는 것이 약이다?',
    },
    {
      id: 'PLif_jr7pPZABQ2BIQoX_IG4kJ46hUJJJA',
      imgUrl: 'https://i.ytimg.com/vi/TQtFOD9q6Ik/hqdefault.jpg',
      title: '침착맨의 뱉은 말은 지킨다',
      description: '달면 삼키고 쓰면 뱉는다',
    },
    {
      id: 'PLif_jr7pPZACAXuOjNHP_FDKuOQ30Gj5l',
      imgUrl: 'https://i.ytimg.com/vi/Kxi0ePKdW84/hqdefault.jpg',
      title: '침착맨 몰아보기 합본판(合本版)',
      description: '켜놓고 퍼자기',
    },
    {
      id: 'PLif_jr7pPZAAdgMaA_J4Tqnp4hKF7VlLK',
      imgUrl: 'https://i.ytimg.com/vi/UDiQvCMne6g/hqdefault.jpg',
      title: '(2022 설특선) 침투부 같이보기',
      description: '2022년 설에도 침착맨 정주행을',
    },
    {
      id: 'PLif_jr7pPZADzPWVoN7DMU5uUu5VQJjQK',
      imgUrl: 'https://i.ytimg.com/vi/uKej8YD7Rlg/hqdefault.jpg',
      title: '고수를 찾아서',
      description: '전국 곳곳에 숨어 있는 무술 고수들의 비기를 실사구시한다',
    },
    {
      id: 'PLif_jr7pPZABaIu8PA94k2o3VHAntTAnv',
      imgUrl: 'https://i.ytimg.com/vi/viPb0y86E4w/hqdefault.jpg',
      title: '침터뷰 시즌 3: 비대면 인터뷰',
      description: '',
    },
    {
      id: 'PLif_jr7pPZACEQ8CWYYcC2GDDqsJ2icOv',
      imgUrl: 'https://i.ytimg.com/vi/WV3KJ-DXKmg/hqdefault.jpg',
      title: '불만 피우면 쿡방',
      description: '쿡방이라고 부르면 안되는데 마땅한 명칭을 못찾아서',
    },
    {
      id: 'PLif_jr7pPZABX0GdP7UUVh3rH00SqxCQi',
      imgUrl: 'https://i.ytimg.com/vi/HbbyfQbJen4/hqdefault.jpg',
      title: '침착맨 오마카세 모음집',
      description: '매주 침착맨이 직접 추천한 영상 모음입니다',
    },
    {
      id: 'PLif_jr7pPZADFKlUnXjf3laJyTCZXM0zn',
      imgUrl: 'https://i.ytimg.com/img/no_thumbnail.jpg',
      title: '이번주 침착맨 오마카세',
      description: '침착맨이 직접 선정하는 이번주 추천영상\n(목요일마다 바뀝니다)',
    },
    {
      id: 'PLif_jr7pPZACxsaghi1juPYbkM6UJMxXk',
      imgUrl: 'https://i.ytimg.com/vi/dang96gloVs/hqdefault.jpg',
      title: '안될과학 궤도 X 침착맨 과학특강',
      description: '과학, 어렵지 않아요 (사실 어려움)',
    },
    {
      id: 'PLif_jr7pPZAAl34cbmBXSM7EGIxHUIMD6',
      imgUrl: 'https://i.ytimg.com/vi/Tr0WHTi6t7Q/hqdefault.jpg',
      title: '(2021 추석특선) 침투부 클래식',
      description: '2021년 추석에도 건강하세요',
    },
    {
      id: 'PLif_jr7pPZADR0tmPGmDymr6XDuBvAuWD',
      imgUrl: 'https://i.ytimg.com/vi/sJNC99aCHkQ/hqdefault.jpg',
      title: '침착맨의 뿌리를 찾아서',
      description: '침착맨은 어떻게 살아왔는가',
    },
  ],
};

const dummyPlaylistItem = [
  {
    json: [
      {
        id: 'ysetd_r8Z9M',
        title: '침투부 Awards 2022: 한 해를 정리하는 권위없는 시상식',
        description:
          '▶관련 영상\n  •침투부 Awards 2021: 한 해를 마무리하며: https://youtu.be/YObxan7RTjw\n\n▶관련 재생목록\n  •침착맨의 일상재롱: https://goo.gl/OJ4Uoa\n\n▶생방송 원본\n  •2022년 12월 29일 방송분: https://youtu.be/XqZsHPUZ24Y\n\n#침착맨 #시상식 #어워즈',
        imgUrl: 'https://i.ytimg.com/vi/ysetd_r8Z9M/maxresdefault.jpg',
      },
      {
        id: 'NeTqujXzubM',
        title: '(※소리주의) 솜사탕 만드는 기계',
        description:
          '▶관련 재생목록\n  •침착맨의 일상재롱: https://goo.gl/OJ4Uoa\n\n▶생방송 원본\n  •2022년 12월 27일 방송분: https://youtu.be/ERbzDq00Cqk\n\n#침착맨 #솜사탕 #만들기',
        imgUrl: 'https://i.ytimg.com/vi/NeTqujXzubM/maxresdefault.jpg',
      },
      {
        id: 'RRnO-9xfJY8',
        title: '많이 먹는 사람과 많이 먹기',
        description:
          '▶관련 재생목록\n  •침착맨의 식욕저하 다이어트 먹방: https://url.kr/a4vk8m\n\n▶생방송 원본\n  •2022년 12월 28일 방송분: https://youtu.be/z5bmNIh8730\n\n▶출연\n  •주우재(@todaywoojae), 침착맨\n\n#침착맨 #주우재 #먹방',
        imgUrl: 'https://i.ytimg.com/vi/RRnO-9xfJY8/maxresdefault.jpg',
      },
      {
        id: 'K6Pfi0yLav8',
        title: '통닭천사 리즈 시절...｜방랑화가 이병건｜EP.05 서울 강남구',
        description:
          '▶촬영 후기와 그림을 감상할 수 있는 방랑화가 이병건 사이버 전시회: https://chimhaha.net/promotion/bangrang\n\n▶관련 재생목록\n  •방랑화가 이병건: https://www.youtube.com/playlist?list=PLif_jr7pPZABUzvHxpGD9IYUDczsRtIPo\n\n▶제작\n  •출연: IVE 리즈(@IVEstarship), 통닭천사( @user-ts7rl8td6u ), 침착맨\n  •기획/연출: 류지명, 한동규, 박지수\n  •조연출: 서주은, 양다연\n\n#침착맨 #통닭천사 #방랑화가이병건 #리즈',
        imgUrl: 'https://i.ytimg.com/vi/K6Pfi0yLav8/maxresdefault.jpg',
      },
      {
        id: 'SP-LJqVgQuw',
        title: '[ENG] 뉴진스 초대석',
        description:
          '▶관련 재생목록\n  •침착맨의 일상재롱: https://goo.gl/OJ4Uoa\n\n▶생방송 원본\n  •2023년 1월 2일 방송분: https://youtu.be/An_hmZZ3m9g\n\n▶출연\n  •뉴진스(@NewJeans_official), 주우재(@todaywoojae), 침착맨\n\n#침착맨 #뉴진스 #주우재',
        imgUrl: 'https://i.ytimg.com/vi/SP-LJqVgQuw/maxresdefault.jpg',
      },
      {
        id: 'vO9sb-w1gdY',
        title: '2023년 또 새롭게 태어난 NEW NEW 침착맨',
        description:
          '▶관련 영상\n  •2021년 새롭게 태어난 NEW 침착맨: https://youtu.be/qrWSm3fTao4\n\n▶관련 재생목록\n  •침착맨의 일상재롱: https://goo.gl/OJ4Uoa\n\n▶생방송 원본\n  •2023년 1월 2일 방송분: https://youtu.be/sQFhFXPV5og\n\n한촌설렁탕 - 김치만두 떡만두국: 10,000원\n\n#침착맨 #소통 #동시송출',
        imgUrl: 'https://i.ytimg.com/vi/vO9sb-w1gdY/maxresdefault.jpg',
      },
      {
        id: 'z_OdvenYnAs',
        title: '빵으로 벌어지는 연고전',
        description:
          '▶관련 재생목록\n  •침착맨의 식욕저하 다이어트 먹방: https://url.kr/a4vk8m\n\n▶생방송 원본\n  •2022년 12월 23일 방송분: https://youtu.be/fGmkFJecCdY\n\n#침착맨 #연대빵 #고대빵',
        imgUrl: 'https://i.ytimg.com/vi/z_OdvenYnAs/maxresdefault.jpg',
      },
      {
        id: 'L2ZBNP_4m8E',
        title: '시청자가 알려주는 오토바이 설명회',
        description:
          '▶관련 영상\n  •【침착맨】 스쿠터가 위험한 이유: https://youtu.be/7Z96Y6EPm-s\n  •시청자가 알려주는 와인 설명회: https://youtu.be/MBepsQF1viY\n\n▶관련 재생목록\n  •침착맨의 일상재롱: https://goo.gl/OJ4Uoa\n\n▶생방송 원본\n  •2022년 12월 27일 방송분: https://youtu.be/ERbzDq00Cqk\n\n#침착맨 #오토바이 #설명회',
        imgUrl: 'https://i.ytimg.com/vi/L2ZBNP_4m8E/maxresdefault.jpg',
      },
      {
        id: 'QAlkUzhL03U',
        title: '고등어 솥밥과 슬램덩크 개혁안',
        description:
          '▶관련 영상\n  •순두부는 왜 뚝배기에 나와야 하는가?: https://youtu.be/wIrnA4tTGNU\n\n▶관련 재생목록\n  •침착맨의 식욕저하 다이어트 먹방: https://url.kr/a4vk8m\n\n▶생방송 원본\n  •2022년 12월 27일 방송분: https://youtu.be/ERbzDq00Cqk\n\n온가솥밥 - 직화 고등어 구이 솥밥: 10,900원\n\n#침착맨 #솥밥 #먹방',
        imgUrl: 'https://i.ytimg.com/vi/QAlkUzhL03U/maxresdefault.jpg',
      },
      {
        id: 'za_EbAThN1A',
        title: '침착맨이 로마군 소대장이 된다면',
        description:
          '▶관련 재생목록\n  •침착맨의 짧게 한 게임들: https://youtube.com/playlist?list=PLif_jr7pPZACiQw3uIILLjASbbGKOS-u2\n\n▶생방송 원본\n  •2022년 12월 27일 방송분: https://youtu.be/ERbzDq00Cqk\n\n#침착맨 #쉴드월 #로마',
        imgUrl: 'https://i.ytimg.com/vi/za_EbAThN1A/maxresdefault.jpg',
      },
    ],
  },
];
